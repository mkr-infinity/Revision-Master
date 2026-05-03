import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Bot,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  Star,
  BookOpen,
  Zap,
  Sigma,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext, BOT_AVATAR, THEMES } from "../context/AppContext";
import { isBotAvatar } from "../components/BotAvatar";
import { PROVIDERS, AiProvider } from "../utils/ai";
import mascotUrl from "../assets/anime-mascot.svg";

const TOTAL_STEPS = 4;

/** Decorative falling sakura petals layer */
const SakuraLayer: React.FC = () => {
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 8,
        scale: 0.6 + Math.random() * 0.9,
        opacity: 0.55 + Math.random() * 0.4,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="sakura"
          style={{
            left: `${p.left}%`,
            top: "-10%",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `scale(${p.scale})`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

/** Animated kira-kira sparkles around the mascot */
const KiraSparkles: React.FC = () => {
  const sparks = [
    { top: "8%", left: "10%", delay: "0s", size: 22 },
    { top: "16%", right: "8%", delay: "0.7s", size: 18 },
    { top: "44%", left: "-2%", delay: "1.4s", size: 14 },
    { bottom: "10%", right: "4%", delay: "0.3s", size: 20 },
    { bottom: "26%", left: "8%", delay: "1.1s", size: 16 },
  ];
  return (
    <>
      {sparks.map((s, i) => (
        <Star
          key={i}
          size={s.size}
          className="kira twinkle absolute"
          style={{
            top: (s as any).top,
            left: (s as any).left,
            right: (s as any).right,
            bottom: (s as any).bottom,
            animationDelay: s.delay,
          }}
          fill="currentColor"
          strokeWidth={1.6}
          stroke="#15101f"
        />
      ))}
    </>
  );
};

const Onboarding = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const { state, updateUser } = useAppContext();
  const currentStep = Math.min(
    TOTAL_STEPS,
    Math.max(1, parseInt(step || "1", 10)),
  );

  const [showKey, setShowKey] = useState(false);

  const setProvider = (id: AiProvider) => updateUser({ aiProvider: id });

  const setKey = (id: AiProvider, value: string) =>
    updateUser({
      apiKeys: { ...(state.user.apiKeys || {}), [id]: value },
      ...(id === "gemini" ? { customApiKey: value } : {}),
    });

  const activeProvider: AiProvider = state.user.aiProvider || "gemini";
  const activeKey =
    (state.user.apiKeys || {})[activeProvider] ||
    (activeProvider === "gemini" ? state.user.customApiKey || "" : "");

  const next = () => {
    if (currentStep < TOTAL_STEPS) navigate(`/onboarding/${currentStep + 1}`);
    else {
      updateUser({ onboardingCompleted: true });
      navigate("/");
    }
  };

  const back = () => {
    if (currentStep > 1) navigate(`/onboarding/${currentStep - 1}`);
  };

  const skip = () => {
    updateUser({
      name: state.user.name || "Scholar",
      examTarget: state.user.examTarget || "General",
      onboardingCompleted: true,
    });
    navigate("/");
  };

  const canProceed = () => {
    if (currentStep === 2)
      return state.user.name.trim() && state.user.examTarget.trim();
    return true;
  };

  const stepBadges = ["Hello", "Profile", "Style", "AI Power"];

  return (
    <div className="relative h-full w-full flex flex-col anime-sky text-primary-fg overflow-hidden">
      {/* Decorative atmosphere */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-60" style={{ background: "color-mix(in srgb, var(--color-primary) 30%, transparent)" }} />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-40" style={{ background: "color-mix(in srgb, var(--color-coral) 25%, transparent)" }} />

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-5 pt-3 pb-2 shrink-0"
        style={{ paddingTop: `calc(env(safe-area-inset-top) + 12px)` }}
      >
        {currentStep > 1 ? (
          <button
            onClick={back}
            className="size-11 rounded-full manga-chip flex items-center justify-center active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="size-11" />
        )}

        <div className="manga-chip px-4 py-1.5 flex items-center gap-1.5">
          <Sparkles size={13} style={{ color: "var(--color-primary)" }} />
          <span className="font-semibold text-[13px] text-primary-fg">
            {stepBadges[currentStep - 1]}
          </span>
          <span className="text-[12px] text-tertiary-fg">
            {currentStep}/{TOTAL_STEPS}
          </span>
        </div>

        <button
          onClick={skip}
          className="manga-chip px-4 h-10 text-sm font-semibold text-secondary-fg active:scale-95 transition-transform"
          aria-label="Skip onboarding"
        >
          Skip
        </button>
      </div>

      {/* Progress bar — clean modern style */}
      <div className="relative z-10 px-5 pb-4 shrink-0">
        <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 75%, var(--color-coral)))",
            }}
            initial={false}
            animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold transition-colors"
              style={{ color: i < currentStep ? 'var(--color-primary)' : 'var(--text-tertiary)' }}
            >
              {stepBadges[i]}
            </span>
          ))}
        </div>
      </div>

      {/* Step body */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-4">
        <AnimatePresence mode="wait">
          {/* STEP 1: Welcome */}
          {currentStep === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28 }}
              className="flex flex-col"
            >
              {/* Hero panel with mascot */}
              <div className="relative mt-2 mb-5">
                <div className="manga-panel p-5 pt-6 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, color-mix(in srgb, var(--color-primary) 14%, var(--bg-elevated)), var(--bg-elevated))",
                  }}
                >
                  <div className="absolute inset-0 halftone" />

                  <div className="relative flex items-end gap-3">
                    {/* Mascot */}
                    <div className="relative w-[140px] h-[168px] shrink-0">
                      <KiraSparkles />
                      <img
                        src={mascotUrl}
                        alt="Revision Master mascot"
                        className="w-full h-full object-contain mascot-bob"
                        style={{ filter: "drop-shadow(0 8px 20px color-mix(in srgb, var(--color-primary) 40%, transparent))" }}
                        draggable={false}
                      />
                    </div>

                    {/* Speech bubble */}
                    <div className="speech-bubble flex-1 px-4 py-3 mb-4">
                      <p className="text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: "var(--color-primary)" }}>
                        Revision Master
                      </p>
                      <p className="font-bold text-lg leading-tight text-primary-fg">
                        Let's go!
                        <br />Ace those exams!
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-4 flex flex-wrap gap-2">
                    {["Hero-grade study", "AI-powered", "Offline-ready"].map((tag) => (
                      <span key={tag} className="manga-chip px-3 py-1 text-[11px] font-semibold text-secondary-fg">
                        ✦ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 gap-2.5 mb-6">
                {[
                  {
                    title: "Flashcards",
                    desc: "Forge decks from any topic with one tap.",
                    icon: <Sparkles size={18} />,
                    bg: "linear-gradient(135deg,#c34dff,#7c3aed)",
                    tag: "CARDS",
                  },
                  {
                    title: "Mock Tests",
                    desc: "Timed battles with full explanations.",
                    icon: <Zap size={18} />,
                    bg: "linear-gradient(135deg,#f59e0b,#ef4444)",
                    tag: "TESTS",
                  },
                  {
                    title: "Formula Library",
                    desc: "Every formula, neatly catalogued.",
                    icon: <Sigma size={18} />,
                    bg: "linear-gradient(135deg,#10b981,#0891b2)",
                    tag: "FORMULAS",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="manga-panel p-3.5 flex items-center gap-3.5 relative overflow-hidden"
                  >
                    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-20 blur-2xl"
                      style={{ background: f.bg }} />
                    <div
                      className="size-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                      style={{ background: f.bg }}
                    >
                      {f.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[15px] leading-tight text-primary-fg">
                        {f.title}
                      </p>
                      <p className="text-[12px] text-secondary-fg leading-snug mt-0.5">
                        {f.desc}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold tracking-widest text-tertiary-fg shrink-0">
                      {f.tag}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Profile */}
          {currentStep === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4" style={{ background: "color-mix(in srgb, var(--color-primary) 12%, var(--bg-elevated))", border: "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)" }}>
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--color-primary)" }}>· Intro ·</span>
              </div>
              <h1 className="font-bold text-[28px] leading-[1.1] mb-2 text-primary-fg">
                Tell me about<br />yourself!
              </h1>
              <p className="text-sm text-secondary-fg mb-6 leading-relaxed max-w-[320px]">
                I'll tune your study plan to match your exam and goals.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase mb-2 block">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={state.user.name}
                    onChange={(e) => updateUser({ name: e.target.value })}
                    placeholder="e.g. Alex Johnson"
                    className="anime-input w-full py-3.5 px-4 text-base font-anime-body"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase mb-2 block">
                    Target exam
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-2.5">
                    {["NEET", "JEE", "CUET", "Boards", "UPSC", "GATE"].map(
                      (exam) => {
                        const active = state.user.examTarget === exam;
                        return (
                          <button
                            key={exam}
                            onClick={() => updateUser({ examTarget: exam })}
                            className={`relative py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                              active
                                ? "text-white shadow-md"
                                : "bg-surface-2 text-primary-fg border border-subtle"
                            }`}
                            style={active ? {
                              background: "linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 75%, var(--color-coral)))",
                              boxShadow: "0 4px 14px -4px var(--color-primary-glow)"
                            } : {}}
                          >
                            {exam}
                            {active && (
                              <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-white flex items-center justify-center" style={{ color: "var(--color-primary)" }}>
                                <Check size={9} strokeWidth={3.5} />
                              </span>
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>
                  <input
                    type="text"
                    value={
                      !["NEET", "JEE", "CUET", "Boards", "UPSC", "GATE"].includes(
                        state.user.examTarget,
                      )
                        ? state.user.examTarget
                        : ""
                    }
                    onChange={(e) => updateUser({ examTarget: e.target.value })}
                    placeholder="Or type your own (e.g. SAT)"
                    className="anime-input w-full py-3 px-4 text-sm font-anime-body"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase mb-2 block">
                    Exam date (optional)
                  </label>
                  <input
                    type="date"
                    value={state.user.examDate || ""}
                    onChange={(e) => updateUser({ examDate: e.target.value })}
                    className="anime-input w-full py-3.5 px-4 text-base font-anime-body"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Style */}
          {currentStep === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4" style={{ background: "color-mix(in srgb, var(--color-primary) 12%, var(--bg-elevated))", border: "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)" }}>
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--color-primary)" }}>· Style ·</span>
              </div>
              <h1 className="font-bold text-[28px] leading-[1.1] mb-2 text-primary-fg">
                Pick your theme!
              </h1>
              <p className="text-sm text-secondary-fg mb-6 leading-relaxed">
                Choose a look that matches your personality.
              </p>

              <p className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase mb-3">
                Theme
              </p>
              <div className="grid grid-cols-3 gap-2.5 mb-7">
                {THEMES.map((t) => {
                  const active = state.user.theme === t.id;
                  const isDark = t.mode === "dark";
                  return (
                    <button
                      key={t.id}
                      onClick={() => updateUser({ theme: t.id })}
                      className={`relative aspect-[3/4] rounded-2xl overflow-hidden transition-all active:scale-95 ${
                        active
                          ? "ring-2 shadow-lg"
                          : "ring-1 ring-black/10 dark:ring-white/10 shadow-md"
                      }`}
                      style={{
                        background: t.swatch,
                        ...(active ? { "--tw-ring-color": t.accent, boxShadow: `0 0 0 2.5px ${t.accent}, 0 8px 20px -6px ${t.accent}80` } as React.CSSProperties : {}),
                      }}
                    >
                      <div className="absolute inset-0 p-1.5 flex flex-col gap-1">
                        <div className="h-1.5 rounded-full w-1/2" style={{ background: t.accent }} />
                        <div className="flex-1 rounded" style={{ background: t.surface }} />
                        <div className="flex gap-1">
                          <div className="h-1.5 flex-1 rounded-full" style={{ background: t.accent }} />
                          <div className="h-1.5 w-1.5 rounded-full" style={{ background: isDark ? "#fff5" : "#0002" }} />
                        </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm py-1 px-1.5">
                        <p className="text-[8.5px] font-semibold tracking-wide text-white truncate text-left">
                          {t.name}
                        </p>
                      </div>
                      {active && (
                        <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-white flex items-center justify-center shadow-sm" style={{ color: t.accent }}>
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase mb-3">
                Avatar
              </p>
              <div className="manga-panel p-4 flex items-center gap-4">
                <div className="relative size-20 rounded-2xl overflow-hidden border border-subtle shadow-md bg-surface-2 shrink-0">
                  <img
                    src={state.user.avatar || BOT_AVATAR}
                    alt="Your avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="font-semibold text-[15px] leading-tight text-primary-fg">
                    {isBotAvatar(state.user.avatar) ? "Default Buddy" : "Custom photo"}
                  </p>
                  <p className="text-[12px] text-secondary-fg leading-snug">
                    Drop your own pic, or stay with the friendly bot.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="manga-chip px-3 py-1.5 text-[11px] font-semibold text-primary-fg cursor-pointer active:scale-95 transition-transform">
                      Upload photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            updateUser({ avatar: reader.result as string });
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    {!isBotAvatar(state.user.avatar) && (
                      <button
                        type="button"
                        onClick={() => updateUser({ avatar: BOT_AVATAR })}
                        className="text-[11px] font-semibold text-secondary-fg underline underline-offset-2 opacity-80"
                      >
                        Use bot
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: AI */}
          {currentStep === 4 && (
            <motion.div
              key="s4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-14 rounded-2xl text-white flex items-center justify-center shadow-md shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, var(--color-coral)))" }}>
                  <Bot size={26} />
                </div>
                <div className="speech-bubble px-4 py-2.5">
                  <p className="font-semibold text-[14px] leading-tight text-primary-fg">
                    Power up time!
                  </p>
                </div>
              </div>

              <h1 className="font-bold text-[28px] leading-[1.1] mb-1.5 text-primary-fg">
                Activate your AI
              </h1>
              <p className="text-sm text-secondary-fg mb-4 leading-relaxed">
                Choose a provider and add your key. You can change this anytime in Settings → AI.
              </p>
              <div className="manga-panel p-3.5 mb-5 flex items-start gap-3">
                <span className="text-[var(--color-primary)] shrink-0 text-base">★</span>
                <p className="text-[12px] leading-relaxed text-secondary-fg">
                  <span className="font-semibold text-primary-fg">Don't know what this is? Just tap Skip ↗</span>
                  <br />
                  You can use the app fully offline without an API key — add one later in Settings → AI when you want AI features.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {PROVIDERS.map((p) => {
                  const active = activeProvider === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProvider(p.id)}
                      className={`p-3.5 rounded-2xl text-left transition-all active:scale-95 ${
                        active
                          ? "text-white shadow-md"
                          : "bg-surface-2 border border-subtle"
                      }`}
                      style={active ? {
                        background: `linear-gradient(135deg, ${p.color}, color-mix(in srgb, ${p.color} 70%, var(--color-primary)))`,
                        boxShadow: `0 6px 18px -6px ${p.color}99`
                      } : {}}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="size-2.5 rounded-full" style={{ background: active ? "#ffffff80" : p.color }} />
                        <span className="font-semibold text-sm">{p.short}</span>
                      </div>
                      <p className={`text-[11px] leading-snug ${active ? "text-white/80" : "text-secondary-fg"}`}>
                        {p.hint}
                      </p>
                    </button>
                  );
                })}
              </div>

              <label className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase mb-2 block">
                {PROVIDERS.find((p) => p.id === activeProvider)?.short} API Key
                {activeProvider === "gemini" ? " (optional)" : ""}
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={activeKey}
                  onChange={(e) => setKey(activeProvider, e.target.value)}
                  placeholder={
                    activeProvider === "gemini"
                      ? "Leave blank to use built-in key"
                      : "Paste your API key"
                  }
                  className="anime-input w-full py-3.5 pl-11 pr-12 text-sm font-anime-body"
                />
                <Key
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-70"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-9 rounded-lg flex items-center justify-center opacity-80"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <a
                href={PROVIDERS.find((p) => p.id === activeProvider)?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold mt-3"
                style={{ color: "var(--color-primary)" }}
              >
                Get a key <ExternalLink size={12} />
              </a>

              <div className="mt-6 manga-panel p-4">
                <div className="flex items-start gap-3">
                  <BookOpen size={18} className="mt-0.5 shrink-0" style={{ color: "var(--color-primary)" }} />
                  <p className="text-xs leading-relaxed opacity-85">
                    Your keys are stored on this device only. If a request fails,
                    you'll see a friendly message and a quick shortcut to update
                    your key.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div
        className="relative z-10 px-5 pt-3 shrink-0 border-t border-subtle"
        style={{
          paddingBottom: `calc(env(safe-area-inset-bottom) + 16px)`,
          background: "color-mix(in srgb, var(--bg-app) 88%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <button
          onClick={next}
          disabled={!canProceed()}
          className="anime-cta w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition-transform"
        >
          {currentStep === TOTAL_STEPS ? "Finish & let's go!" : "Continue"}
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
