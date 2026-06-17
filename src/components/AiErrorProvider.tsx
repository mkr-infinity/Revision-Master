import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  ShieldAlert,
  WifiOff,
  Hourglass,
  X,
  ArrowRight,
  Bot,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AiError, providerName, AiProvider } from "../utils/ai";

interface AiErrorState {
  open: boolean;
  code: AiError["code"] | "unknown";
  provider: AiProvider | null;
  message: string;
  context?: string;
}

interface Ctx {
  showAiError: (err: unknown, context?: string) => void;
}

const C = createContext<Ctx | null>(null);

export const useAiErrorModal = () => {
  const v = useContext(C);
  if (!v) throw new Error("useAiErrorModal must be used within AiErrorProvider");
  return v;
};

const palette: Record<
  AiErrorState["code"],
  { color: string; bg: string; ring: string; Icon: React.FC<any>; title: string }
> = {
  missing_key: {
    color: "text-amber-500",
    bg: "from-amber-500/15 to-amber-500/5",
    ring: "ring-amber-500/30",
    Icon: Key,
    title: "Add your API key",
  },
  invalid_key: {
    color: "text-rose-500",
    bg: "from-rose-500/15 to-rose-500/5",
    ring: "ring-rose-500/30",
    Icon: ShieldAlert,
    title: "Invalid API key",
  },
  rate_limit: {
    color: "text-orange-500",
    bg: "from-orange-500/15 to-orange-500/5",
    ring: "ring-orange-500/30",
    Icon: Hourglass,
    title: "Too many requests",
  },
  network: {
    color: "text-sky-500",
    bg: "from-sky-500/15 to-sky-500/5",
    ring: "ring-sky-500/30",
    Icon: WifiOff,
    title: "Network hiccup",
  },
  unknown: {
    color: "text-[var(--color-primary)]",
    bg: "from-[var(--color-primary)]/15 to-[var(--color-primary)]/5",
    ring: "ring-[var(--color-primary)]/30",
    Icon: Sparkles,
    title: "MKR Ai error",
  },
};

export const AiErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AiErrorState>({
    open: false,
    code: "unknown",
    provider: null,
    message: "",
  });

  const showAiError = useCallback((err: unknown, context?: string) => {
    const e = err as Partial<AiError>;
    const code: AiErrorState["code"] = (e?.code as any) || "unknown";
    const provider: AiProvider | null = (e?.provider as AiProvider) || null;
    const message =
      e?.userMessage ||
      e?.message ||
      "Something went wrong while contacting MKR Ai.";
    setState({ open: true, code, provider, message, context });
  }, []);

  const close = () => setState((s) => ({ ...s, open: false }));

  const value = useMemo(() => ({ showAiError }), [showAiError]);

  const meta = palette[state.code] || palette.unknown;
  const showOpenSettings =
    state.code === "missing_key" || state.code === "invalid_key";

  return (
    <C.Provider value={value}>
      {children}
      <AnimatePresence>
        {state.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-start sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
            onClick={close}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-sm bg-elevated border border-subtle rounded-3xl shadow-card-lg overflow-hidden`}
            >
              {/* hero */}
              <div
                className={`relative bg-gradient-to-br ${meta.bg} p-5 pb-7`}
              >
                <button
                  onClick={close}
                  className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-tertiary-fg"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

                <div className="flex items-start gap-3">
                  <div
                    className={`size-12 rounded-2xl bg-elevated flex items-center justify-center ring-2 ${meta.ring} ${meta.color} shrink-0`}
                  >
                    <meta.Icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-tertiary-fg mb-0.5 flex items-center gap-1.5">
                      <Bot size={11} /> MKR Ai
                      {state.provider && (
                        <span className="text-tertiary-fg/70">
                          · {providerName(state.provider)}
                        </span>
                      )}
                    </p>
                    <h3 className="text-lg font-black leading-tight">
                      {meta.title}
                    </h3>
                    {state.context && (
                      <p className="text-[11px] text-tertiary-fg mt-0.5">
                        While {state.context}
                      </p>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm text-secondary-fg leading-relaxed">
                  {state.message}
                </p>
              </div>

              {/* Action */}
              <div className="p-4 flex gap-2">
                <button
                  onClick={close}
                  className="flex-1 py-3 rounded-2xl font-bold bg-surface-2 text-secondary-fg active:scale-[0.98]"
                >
                  Dismiss
                </button>
                {showOpenSettings && (
                  <button
                    onClick={() => {
                      close();
                      navigate("/settings", { state: { openModal: "aiSettings" } });
                    }}
                    className="flex-[1.4] py-3 rounded-2xl font-bold gradient-violet text-white shadow-glow active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Open AI settings <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </C.Provider>
  );
};

export default AiErrorProvider;
