import { GoogleGenAI, Type as GeminiType } from "@google/genai";

export type AiProvider = "gemini" | "openai" | "grok" | "anthropic";

export interface ApiKeys {
  gemini?: string;
  openai?: string;
  grok?: string;
  anthropic?: string;
}

export interface AiUserSettings {
  aiProvider?: AiProvider;
  apiKeys?: ApiKeys;
  customApiKey?: string;
  aiEnabled?: boolean;
}

export interface AiError extends Error {
  code: "missing_key" | "invalid_key" | "rate_limit" | "network" | "unknown";
  provider: AiProvider;
  userMessage: string;
}

export const PROVIDERS: {
  id: AiProvider;
  name: string;
  short: string;
  hint: string;
  url: string;
  color: string;
}[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    short: "Gemini",
    hint: "Default. Free tier available.",
    url: "https://aistudio.google.com/apikey",
    color: "#9b6bff",
  },
  {
    id: "openai",
    name: "OpenAI ChatGPT",
    short: "ChatGPT",
    hint: "GPT-4o mini and friends.",
    url: "https://platform.openai.com/api-keys",
    color: "#10a37f",
  },
  {
    id: "grok",
    name: "xAI Grok",
    short: "Grok",
    hint: "Elon's xAI. Bring your key.",
    url: "https://console.x.ai/",
    color: "#ff7849",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    short: "Claude",
    hint: "Claude Sonnet / Haiku.",
    url: "https://console.anthropic.com/settings/keys",
    color: "#d97757",
  },
];

const buildError = (
  provider: AiProvider,
  code: AiError["code"],
  userMessage: string,
  original?: any,
): AiError => {
  const e = new Error(userMessage) as AiError;
  e.code = code;
  e.provider = provider;
  e.userMessage = userMessage;
  if (original?.stack) e.stack = original.stack;
  return e;
};

const classifyError = (provider: AiProvider, error: any): AiError => {
  const msg = String(error?.message || error || "").toLowerCase();
  const status = error?.status || error?.code;
  if (
    msg.includes("api_key_invalid") ||
    msg.includes("invalid api key") ||
    msg.includes("invalid_api_key") ||
    msg.includes("incorrect api key") ||
    msg.includes("unauthorized") ||
    status === 401 ||
    status === 403
  ) {
    return buildError(
      provider,
      "invalid_key",
      `Your ${providerName(provider)} API key is invalid. Add a working key in Settings → AI.`,
      error,
    );
  }
  if (msg.includes("rate") || status === 429) {
    return buildError(
      provider,
      "rate_limit",
      `${providerName(provider)} rate limit hit. Try again or use your own API key in Settings → AI.`,
      error,
    );
  }
  if (msg.includes("network") || msg.includes("fetch") || msg.includes("failed to")) {
    return buildError(
      provider,
      "network",
      `Network issue talking to ${providerName(provider)}. Check your connection.`,
      error,
    );
  }
  return buildError(
    provider,
    "unknown",
    `${providerName(provider)} request failed. Try again or switch provider in Settings → AI.`,
    error,
  );
};

export const providerName = (p: AiProvider) =>
  PROVIDERS.find((x) => x.id === p)?.short || p;

export const resolveProviderAndKey = (
  user: AiUserSettings,
): { provider: AiProvider; apiKey: string | undefined } => {
  const provider: AiProvider = user.aiProvider || "gemini";
  const keys = user.apiKeys || {};
  let apiKey: string | undefined = keys[provider]?.trim() || undefined;

  // Backwards compat: legacy single key was always Gemini
  if (provider === "gemini" && !apiKey && user.customApiKey?.trim()) {
    apiKey = user.customApiKey.trim();
  }
  // Built-in fallback only for Gemini
  if (provider === "gemini" && !apiKey) {
    const env = (typeof process !== "undefined" && (process as any).env) || {};
    apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
  }
  return { provider, apiKey };
};

const ensureKey = (provider: AiProvider, apiKey: string | undefined) => {
  if (!apiKey) {
    throw buildError(
      provider,
      "missing_key",
      `${providerName(provider)} API key is missing. Add one in Settings → AI to start using AI features.`,
    );
  }
};

export const assertAiEnabled = (user: AiUserSettings) => {
  if (user.aiEnabled === false) {
    throw buildError(
      user.aiProvider || "gemini",
      "missing_key",
      "MKR Ai is turned off. Enable it in Settings → AI to use any AI features.",
    );
  }
};

const SYSTEM_DEFAULT =
  "You are MKR Ai, a focused study assistant inside the Revision Master app made by Kaif. Be concise, accurate, and friendly. You are not affiliated with the model provider.";

export interface GenerateOptions {
  system?: string;
  temperature?: number;
  jsonSchema?: any;
}

export const generateText = async (
  user: AiUserSettings,
  prompt: string,
  options: GenerateOptions = {},
): Promise<string> => {
  assertAiEnabled(user);
  const { provider, apiKey } = resolveProviderAndKey(user);
  ensureKey(provider, apiKey);

  const system = options.system || SYSTEM_DEFAULT;

  try {
    if (provider === "gemini") {
      const ai = new GoogleGenAI({ apiKey: apiKey! });
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: system,
          temperature: options.temperature,
          ...(options.jsonSchema
            ? { responseMimeType: "application/json", responseSchema: options.jsonSchema }
            : {}),
        },
      });
      return res.text || "";
    }

    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
          temperature: options.temperature ?? 0.7,
          ...(options.jsonSchema ? { response_format: { type: "json_object" } } : {}),
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw Object.assign(new Error(body), { status: res.status });
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    }

    if (provider === "grok") {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-2-latest",
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
          temperature: options.temperature ?? 0.7,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw Object.assign(new Error(body), { status: res.status });
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    }

    if (provider === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey!,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-latest",
          max_tokens: 2048,
          system,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw Object.assign(new Error(body), { status: res.status });
      }
      const data = await res.json();
      return data.content?.[0]?.text || "";
    }

    throw buildError(provider, "unknown", "Unsupported provider.");
  } catch (err: any) {
    if ((err as AiError).code) throw err;
    throw classifyError(provider, err);
  }
};

export const generateJson = async <T = any>(
  user: AiUserSettings,
  prompt: string,
  schema: any,
  options: GenerateOptions = {},
): Promise<T> => {
  const enrichedPrompt =
    options.jsonSchema || schema
      ? prompt +
        "\n\nReturn ONLY valid JSON matching the requested structure. No prose, no markdown, no code fences."
      : prompt;
  const text = await generateText(user, enrichedPrompt, {
    ...options,
    jsonSchema: schema,
  });
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch (e: any) {
    const start = cleaned.indexOf("{");
    const startA = cleaned.indexOf("[");
    const idx =
      start === -1 ? startA : startA === -1 ? start : Math.min(start, startA);
    const lastEnd = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
    if (idx >= 0 && lastEnd > idx) {
      try {
        return JSON.parse(cleaned.slice(idx, lastEnd + 1)) as T;
      } catch {
        /* fallthrough */
      }
    }
    throw buildError(
      "gemini",
      "unknown",
      "AI returned data we couldn't parse. Try again or switch provider in Settings → AI.",
      e,
    );
  }
};

export { GeminiType };

/**
 * Generate an image (data URL) from a topic prompt.
 * Currently uses Google Gemini's image generation. Falls back gracefully.
 */
export const generateImage = async (
  user: AiUserSettings,
  prompt: string,
): Promise<string> => {
  assertAiEnabled(user);
  // Image generation routes through Gemini regardless of selected provider.
  const keys = user.apiKeys || {};
  let apiKey = keys.gemini?.trim() || user.customApiKey?.trim();
  if (!apiKey) {
    const env = (typeof process !== "undefined" && (process as any).env) || {};
    apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
  }
  if (!apiKey) {
    throw buildError(
      "gemini",
      "missing_key",
      "Image generation needs a Gemini API key. Add one in Settings → AI.",
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const res: any = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: `Create a clean, premium, study-themed cover illustration for: "${prompt}". Subject should be visually rich but not text-heavy. Use modern, soft lighting and editorial style.`,
    } as any);
    // Extract first inline image
    const candidates = res?.candidates || [];
    for (const c of candidates) {
      const parts = c?.content?.parts || [];
      for (const p of parts) {
        const inline = p?.inlineData || p?.inline_data;
        if (inline?.data) {
          const mime = inline.mimeType || inline.mime_type || "image/png";
          return `data:${mime};base64,${inline.data}`;
        }
      }
    }
    throw new Error("No image returned");
  } catch (err: any) {
    if ((err as AiError).code) throw err;
    throw classifyError("gemini", err);
  }
};
