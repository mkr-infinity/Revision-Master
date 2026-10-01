/**
 * Revision Master — social sign-in helpers
 * ------------------------------------------------------------
 * Google  → Google Identity Services (OAuth 2.0 token client + userinfo)
 * Apple   → Sign in with Apple JS (popup mode)
 *
 * Both providers are configured through Vite env vars (see `.env.example`).
 * If a provider has no client ID configured the app falls back to a local
 * "demo" profile so the login screen is still fully usable offline / in dev.
 *
 * NOTE: everything below runs client-side. The ID token is decoded (not
 * cryptographically verified) purely to read name / email / picture. A real
 * production backend should verify the token server-side — see AUTH_SETUP.md.
 */

import { Capacitor } from "@capacitor/core";

export type AuthProvider = "google" | "apple" | "guest" | "email";

export interface AuthProfile {
  provider: AuthProvider;
  /** Provider subject id (Google `sub`, Apple `sub`) when available. */
  providerId?: string;
  email?: string;
  name?: string;
  picture?: string;
  /** True when the profile came from the offline demo fallback. */
  demo?: boolean;
}

export class AuthError extends Error {
  code: string;
  constructor(message: string, code = "auth_error") {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const env = (import.meta as any).env ?? {};

export const AUTH_CONFIG = {
  googleClientId: (env.VITE_GOOGLE_CLIENT_ID || "").trim(),
  appleClientId: (env.VITE_APPLE_CLIENT_ID || "").trim(),
  appleRedirectUri:
    (env.VITE_APPLE_REDIRECT_URI || "").trim() ||
    (typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : ""),
};

export const isGoogleConfigured = () => AUTH_CONFIG.googleClientId.length > 0;
export const isAppleConfigured = () => AUTH_CONFIG.appleClientId.length > 0;
export const isDemoMode = () => !isGoogleConfigured() && !isAppleConfigured();
export const isNative = () => Capacitor.isNativePlatform();

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

/** Decode the payload of a JWT without verifying the signature. */
export const decodeJwt = (token: string): Record<string, any> => {
  try {
    const payload = token.split(".")[1];
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    throw new AuthError("Could not read the sign-in response from the provider.", "bad_token");
  }
};

const loadScript = (src: string, id: string) =>
  new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) return resolve();
    const el = document.createElement("script");
    el.id = id;
    el.src = src;
    el.async = true;
    el.defer = true;
    el.onload = () => resolve();
    el.onerror = () =>
      reject(
        new AuthError(
          "Could not reach the sign-in service. Check your internet connection and try again.",
          "script_load_failed",
        ),
      );
    document.head.appendChild(el);
  });

const randomString = (bytes = 32) => {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
};

const sha256Hex = async (value: string) => {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
};

/** Offline fallback profile — keeps the login screen usable without OAuth keys. */
export const demoProfile = (provider: AuthProvider): AuthProfile => {
  const label = provider === "apple" ? "Apple" : provider === "google" ? "Google" : "Guest";
  return {
    provider,
    providerId: `demo-${provider}-${Date.now().toString(36)}`,
    email: provider === "guest" ? undefined : `demo.${provider}@revisionmaster.app`,
    name: label === "Guest" ? "Guest Scholar" : `${label} Demo User`,
    demo: true,
  };
};

/* ------------------------------------------------------------------ */
/* Google                                                             */
/* ------------------------------------------------------------------ */

const GOOGLE_GIS_SRC = "https://accounts.google.com/gsi/client";

/**
 * Opens Google's OAuth consent popup and resolves with the signed-in profile.
 * Uses the OAuth 2.0 token client so the popup is triggered from a real user
 * gesture (works in Chrome/Safari/Edge; needs the page origin whitelisted as
 * an "Authorised JavaScript origin" in Google Cloud Console).
 */
export const signInWithGoogle = async (): Promise<AuthProfile> => {
  if (isNative()) {
    throw new AuthError(
      "Google sign-in inside the Android/iOS build needs OAuth deep-link setup. See AUTH_SETUP.md, or continue as a guest.",
      "native_unsupported",
    );
  }
  if (!isGoogleConfigured()) return demoProfile("google");

  await loadScript(GOOGLE_GIS_SRC, "google-gsi-client");
  const g = (window as any).google;
  if (!g?.accounts?.oauth2) {
    throw new AuthError("Google sign-in failed to initialise. Please try again.", "init_failed");
  }

  const token = await new Promise<{ access_token?: string; error?: string; error_description?: string }>(
    (resolve, reject) => {
      let settled = false;
      const client = g.accounts.oauth2.initTokenClient({
        client_id: AUTH_CONFIG.googleClientId,
        scope: "openid email profile",
        prompt: "select_account",
        callback: (response: any) => {
          settled = true;
          resolve(response || {});
        },
        error_callback: (err: any) => {
          settled = true;
          reject(
            new AuthError(
              err?.message || "Google sign-in was cancelled.",
              err?.type === "popup_closed" ? "popup_closed" : "google_error",
            ),
          );
        },
      });

      try {
        client.requestAccessToken({ prompt: "select_account" });
      } catch (e: any) {
        if (!settled) reject(new AuthError(e?.message || "Google sign-in failed.", "google_error"));
      }
    },
  );

  if (token.error) {
    throw new AuthError(token.error_description || "Google sign-in failed.", token.error);
  }
  if (!token.access_token) {
    throw new AuthError("Google did not return an access token.", "no_token");
  }

  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!res.ok) {
    throw new AuthError("Could not load your Google profile. Please try again.", "userinfo_failed");
  }
  const info = await res.json();

  return {
    provider: "google",
    providerId: info.sub,
    email: info.email,
    name: info.name || info.given_name || info.email,
    picture: info.picture,
  };
};

/* ------------------------------------------------------------------ */
/* Apple                                                              */
/* ------------------------------------------------------------------ */

const APPLE_JS_SRC =
  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

/**
 * Sign in with Apple (popup mode).
 * Requires a Services ID + a Return URL registered in the Apple Developer
 * portal — see AUTH_SETUP.md. `nonce` is passed hashed, as Apple recommends.
 */
export const signInWithApple = async (): Promise<AuthProfile> => {
  if (isNative()) {
    throw new AuthError(
      "Apple sign-in inside the Android/iOS build needs OAuth deep-link setup. See AUTH_SETUP.md, or continue as a guest.",
      "native_unsupported",
    );
  }
  if (!isAppleConfigured()) return demoProfile("apple");

  await loadScript(APPLE_JS_SRC, "appleid-js");
  const AppleID = (window as any).AppleID;
  if (!AppleID?.auth) {
    throw new AuthError("Apple sign-in failed to initialise. Please try again.", "init_failed");
  }

  const rawNonce = randomString(16);
  const hashedNonce = await sha256Hex(rawNonce);

  AppleID.auth.init({
    clientId: AUTH_CONFIG.appleClientId,
    scope: "name email",
    redirectURI: AUTH_CONFIG.appleRedirectUri,
    nonce: hashedNonce,
    usePopup: true,
  });

  let response: any;
  try {
    response = await AppleID.auth.signIn();
  } catch (err: any) {
    const code = err?.error || "apple_error";
    throw new AuthError(
      code === "popup_closed_by_user"
        ? "Apple sign-in was cancelled."
        : err?.error_description || err?.message || "Apple sign-in failed.",
      code,
    );
  }

  const idToken = response?.authorization?.id_token;
  const claims = idToken ? decodeJwt(idToken) : {};
  const name = response?.user?.name
    ? [response.user.name.firstName, response.user.name.lastName].filter(Boolean).join(" ")
    : claims.name || claims.email;

  return {
    provider: "apple",
    providerId: claims.sub,
    email: claims.email,
    name: name || "Apple User",
    picture: undefined,
  };
};

/* ------------------------------------------------------------------ */
/* Shared entry point                                                  */
/* ------------------------------------------------------------------ */

export const signInWith = async (provider: "google" | "apple"): Promise<AuthProfile> =>
  provider === "google" ? signInWithGoogle() : signInWithApple();

/** Guest / offline profile — no provider round-trip at all. */
export const signInAsGuest = async (): Promise<AuthProfile> => demoProfile("guest");

/** Human-readable provider label. */
export const providerLabel = (provider?: AuthProvider) =>
  provider === "google"
    ? "Google"
    : provider === "apple"
      ? "Apple"
      : provider === "guest"
        ? "Guest"
        : provider === "email"
          ? "Email"
          : "";
