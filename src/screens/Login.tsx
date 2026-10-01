import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, Lock, ShieldCheck, Sparkles, Star, UserRound } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import SakuraLayer from "../components/SakuraLayer";
import { AppleMark, GoogleMark } from "../components/BrandIcons";
import {
  AuthError,
  AuthProfile,
  isAppleConfigured,
  isGoogleConfigured,
  isNative,
  providerLabel,
  signInWith,
} from "../utils/auth";
import appLogo from "../assets/logo.svg";
import mascotUrl from "../assets/anime-mascot.svg";

type Busy = "google" | "apple" | "guest" | null;

const GoogleButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  demo?: boolean;
}> = ({ onClick, disabled, busy, demo }) => (
  <motion.button
    whileTap={{ scale: 0.975 }}
    onClick={onClick}
    disabled={disabled}
    className="w-full h-[54px] rounded-2xl flex items-center justify-center gap-3 font-bold text-[15px] transition-all disabled:opacity-60 disabled:cursor-not-allowed
               border border-black/10
               shadow-[0_10px_26px_-14px_rgba(0,0,0,0.5)] hover:shadow-[0_14px_30px_-14px_rgba(0,0,0,0.55)]"
    // Deliberately hard-coded: Google's brand button must stay white on every theme.
    style={{ background: "#ffffff", color: "#1f1f1f" }}
  >
    <span className="size-6 rounded-full bg-white flex items-center justify-center">
      {busy ? <Loader2 size={18} className="animate-spin text-[#4285F4]" /> : <GoogleMark size={20} />}
    </span>
    <span>Continue with Google</span>
    {demo && (
      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black/5 text-black/45">
        Demo
      </span>
    )}
  </motion.button>
);

const AppleButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  demo?: boolean;
}> = ({ onClick, disabled, busy, demo }) => (
  <motion.button
    whileTap={{ scale: 0.975 }}
    onClick={onClick}
    disabled={disabled}
    className="w-full h-[54px] rounded-2xl flex items-center justify-center gap-3 font-bold text-[15px] transition-all disabled:opacity-60 disabled:cursor-not-allowed
               border border-black/40
               shadow-[0_10px_26px_-14px_rgba(0,0,0,0.7)] hover:shadow-[0_14px_30px_-14px_rgba(0,0,0,0.8)]"
    // Apple's brand button is always black, even in light themes.
    style={{ background: "#000000", color: "#ffffff" }}
  >
    {busy ? (
      <Loader2 size={18} className="animate-spin" />
    ) : (
      <AppleMark size={20} className="-mt-0.5" />
    )}
    <span>Continue with Apple</span>
    {demo && (
      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/15 text-white/70">
        Demo
      </span>
    )}
  </motion.button>
);

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { state, signIn } = useAppContext();

  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const googleDemo = !isGoogleConfigured();
  const appleDemo = !isAppleConfigured();
  const demoMode = googleDemo && appleDemo;

  // Already signed in? Straight into the app.
  useEffect(() => {
    if (state.auth?.isAuthenticated) {
      navigate(state.user.onboardingCompleted ? "/" : "/onboarding/1", { replace: true });
    }
  }, [state.auth?.isAuthenticated, state.user.onboardingCompleted, navigate]);

  const handleProvider = async (provider: "google" | "apple") => {
    if (busy) return;
    setError(null);
    setNotice(null);
    setBusy(provider);
    try {
      const profile: AuthProfile = await signInWith(provider);
      signIn(profile);
      if (profile.demo) {
        setNotice(
          `Signed in as a ${providerLabel(provider)} demo profile — add your OAuth client ID to enable the real flow.`,
        );
      }
      navigate(state.user.onboardingCompleted ? "/" : "/onboarding/1", { replace: true });
    } catch (e) {
      const message =
        e instanceof AuthError
          ? e.message
          : "Something went wrong while signing in. Please try again.";
      setError(message);
    } finally {
      setBusy(null);
    }
  };

  const handleGuest = () => {
    if (busy) return;
    setError(null);
    setBusy("guest");
    signIn({ provider: "guest", name: "Guest Scholar" });
    navigate(state.user.onboardingCompleted ? "/" : "/onboarding/1", { replace: true });
    setBusy(null);
  };

  return (
    <div className="relative h-full w-full flex flex-col anime-sky text-primary-fg overflow-hidden">
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute -top-28 -left-24 w-80 h-80 rounded-full blur-3xl opacity-70"
        style={{ background: "color-mix(in srgb, var(--color-primary) 34%, transparent)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-28 -right-24 w-80 h-80 rounded-full blur-3xl opacity-50"
        style={{ background: "color-mix(in srgb, var(--color-coral) 28%, transparent)" }}
      />
      <div className="pointer-events-none absolute inset-0 speed-lines" />
      <SakuraLayer count={12} />

      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto px-5 pt-[calc(env(safe-area-inset-top)+22px)] pb-[calc(env(safe-area-inset-bottom)+18px)]">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center shrink-0"
        >
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -m-5 rounded-[34px] blur-2xl opacity-70"
              style={{
                background: "radial-gradient(closest-side, var(--color-primary), transparent 70%)",
              }}
            />
            <img
              src={appLogo}
              alt="Revision Master"
              className="relative size-20 rounded-3xl shadow-glow"
              draggable={false}
            />
          </div>
          <h1 className="mt-4 font-anime-pop text-[30px] leading-none text-primary-fg">
            Revision Master
          </h1>
          <p className="mt-2 text-[12px] font-bold tracking-[0.18em] uppercase text-tertiary-fg">
            Study · Revise · Master
          </p>
        </motion.div>

        {/* Hero panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="mt-6 manga-panel relative overflow-hidden p-4 pt-5 shrink-0"
          style={{
            background:
              "linear-gradient(145deg, color-mix(in srgb, var(--color-primary) 13%, var(--bg-elevated)), var(--bg-elevated))",
          }}
        >
          <div className="absolute inset-0 halftone" />
          <div className="relative flex items-center gap-3">
            <div className="relative w-[122px] h-[130px] shrink-0">
              {[
                { top: "6%", left: "2%", delay: "0s", size: 18 },
                { top: "40%", right: "-2%", delay: "0.8s", size: 14 },
                { bottom: "6%", left: "10%", delay: "1.4s", size: 16 },
              ].map((s, i) => (
                <Star
                  key={i}
                  size={s.size}
                  className="kira twinkle absolute"
                  style={{ top: s.top, left: (s as any).left, right: (s as any).right, bottom: (s as any).bottom, animationDelay: s.delay }}
                  fill="currentColor"
                  strokeWidth={1.6}
                  stroke="#15101f"
                />
              ))}
              <img
                src={mascotUrl}
                alt=""
                className="w-full h-full object-contain object-bottom mascot-bob"
                style={{
                  filter:
                    "drop-shadow(0 8px 20px color-mix(in srgb, var(--color-primary) 40%, transparent))",
                }}
                draggable={false}
              />
            </div>
            <div className="speech-bubble flex-1 px-4 py-3">
              <p
                className="text-[10px] font-bold tracking-[0.16em] uppercase mb-1"
                style={{ color: "var(--color-primary)" }}
              >
                Welcome back!
              </p>
              <p className="font-bold text-[15px] leading-snug text-primary-fg">
                Sign in to sync your decks, streaks and exam progress.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          className="mt-5 space-y-3 shrink-0"
        >
          <GoogleButton
            onClick={() => handleProvider("google")}
            disabled={!!busy}
            busy={busy === "google"}
            demo={googleDemo}
          />
          <AppleButton
            onClick={() => handleProvider("apple")}
            disabled={!!busy}
            busy={busy === "apple"}
            demo={appleDemo}
          />

          <div className="flex items-center gap-3 pt-1">
            <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-tertiary-fg">
              or
            </span>
            <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          </div>

          <motion.button
            whileTap={{ scale: 0.975 }}
            onClick={handleGuest}
            disabled={!!busy}
            className="manga-chip w-full h-[52px] rounded-2xl flex items-center justify-center gap-2.5 font-bold text-[15px] text-secondary-fg disabled:opacity-60"
          >
            {busy === "guest" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <UserRound size={18} />
            )}
            <span>Continue as guest</span>
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-start gap-2.5 rounded-2xl px-3.5 py-3 text-[12.5px] font-semibold leading-snug"
                style={{
                  background: "color-mix(in srgb, #ff3b5c 12%, var(--bg-elevated))",
                  border: "1px solid color-mix(in srgb, #ff3b5c 35%, transparent)",
                  color: "var(--text-primary)",
                }}
                role="alert"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" style={{ color: "#ff3b5c" }} />
                <span>{error}</span>
              </motion.div>
            )}

            {notice && !error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-start gap-2.5 rounded-2xl px-3.5 py-3 text-[12.5px] font-semibold leading-snug"
                style={{
                  background: "color-mix(in srgb, var(--color-primary) 10%, var(--bg-elevated))",
                  border: "1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)",
                  color: "var(--text-primary)",
                }}
              >
                <Sparkles size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-primary)" }} />
                <span>{notice}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Spacer so the footer sits at the bottom on tall screens */}
        <div className="flex-1 min-h-4" />

        {/* Trust + demo notes */}
        <div className="mt-5 space-y-2.5 shrink-0">
          {demoMode && (
            <div
              className="rounded-2xl px-3.5 py-3 text-[11.5px] font-semibold leading-relaxed"
              style={{
                background: "color-mix(in srgb, var(--bg-elevated) 88%, var(--color-primary))",
                border: "1px dashed color-mix(in srgb, var(--color-primary) 40%, transparent)",
                color: "var(--text-secondary)",
              }}
            >
              <span className="font-black uppercase tracking-wider text-[10px]" style={{ color: "var(--color-primary)" }}>
                Preview mode · {" "}
              </span>
              No OAuth client IDs configured yet, so Google &amp; Apple sign you in with a local demo
              profile. Add <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> /{" "}
              <code className="font-mono">VITE_APPLE_CLIENT_ID</code> to enable the real flows
              (see AUTH_SETUP.md).
            </div>
          )}

          {isNative() && (
            <div
              className="rounded-2xl px-3.5 py-3 text-[11.5px] font-semibold leading-relaxed"
              style={{
                background: "color-mix(in srgb, var(--bg-elevated) 88%, var(--color-primary))",
                border: "1px dashed color-mix(in srgb, var(--color-primary) 40%, transparent)",
                color: "var(--text-secondary)",
              }}
            >
              Android/iOS build detected — social sign-in needs OAuth deep links (AUTH_SETUP.md).
              Guest mode works everywhere.
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-tertiary-fg">
            <ShieldCheck size={13} />
            <span>We only read your name, email and photo</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-tertiary-fg">
            <Lock size={13} />
            <span>No password stored · data stays on this device</span>
          </div>

          <p className="text-center text-[10.5px] leading-relaxed text-tertiary-fg pt-1">
            By continuing you agree to the{" "}
            <span className="font-bold" style={{ color: "var(--color-primary)" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-bold" style={{ color: "var(--color-primary)" }}>
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>

      {/* Full-screen busy veil (provider popups can take a moment) */}
      <AnimatePresence>
        {busy && busy !== "guest" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3"
            style={{ background: "color-mix(in srgb, var(--bg-app) 65%, transparent)", backdropFilter: "blur(6px)" }}
          >
            <Loader2 size={26} className="animate-spin" style={{ color: "var(--color-primary)" }} />
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-secondary-fg">
              Connecting to {providerLabel(busy as any) || "provider"}…
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
