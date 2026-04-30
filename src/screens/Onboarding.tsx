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
    <div className="relative h-full w-full flex flex-col anime-sky text-[#15101f] dark:text-[#f7e9d2] font-anime-body overflow-hidden">
      {/* Decorative atmosphere */}
      <SakuraLayer />
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-400/40 blur-3xl" />

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
          <Sparkles size={14} className="text-[#ff6b81]" />
          <span className="font-anime-pop text-[13px] tracking-wider">
            {stepBadges[currentStep - 1]}
          </span>
          <span className="font-anime-pop text-[12px] opacity-70">
            {currentStep}/{TOTAL_STEPS}
          </span>
        </div>

        <button
          onClick={skip}
          className="manga-chip px-4 h-11 text-sm font-anime-pop active:scale-95"
          aria-label="Skip onboarding"
        >
          Skip
        </button>
      </div>

      {/* Progress bar — manga style */}
      <div className="relative z-10 px-5 pb-3 shrink-0">
        <div className="h-3 w-full rounded-full border-2 border-[#15101f] dark:border-[#f7e9d2] bg-white/60 dark:bg-black/30 overflow-hidden shadow-[3px_3px_0_0_#15101f] dark:shadow-[3px_3px_0_0_#f7e9d2]">
          <motion.div
            className="h-full"
            style={{
              background:
                "repeating-linear-gradient(135deg, #ff6b81 0 12px, #ffb648 12px 24px, #c34dff 24px 36px)",
            }}
            initial={false}
            animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
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
                <div className="absolute inset-0 rounded-[36px] speed-lines" />
                <div className="manga-panel p-5 pt-6 relative overflow-hidden">
                  <div className="absolute inset-0 halftone opacity-40" />

                  <div className="relative flex items-end gap-3">
                    {/* Mascot */}
                    <div className="relative w-[150px] h-[180px] shrink-0">
                      <KiraSparkles />
                      <img
                        src={mascotUrl}
                        alt="Revision Master mascot"
                        className="w-full h-full object-contain mascot-bob drop-shadow-[4px_4px_0_#15101f]"
                        draggable={false}
                      />
                    </div>

                    {/* Speech bubble */}
                    <div className="speech-bubble flex-1 px-4 py-3 mb-4">
                      <p className="font-anime-pop text-[11px] tracking-[0.18em] text-[#c34dff]">
                        REVISION MASTER
                      </p>
                      <p className="font-anime-pop text-xl leading-tight mt-1">
                        Let's go!
                        <br />Ace those exams!
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-5 flex flex-wrap gap-2">
                    <span className="manga-chip px-3 py-1 text-[11px] font-anime-pop">
                      ✦ Hero-grade study
                    </span>
                    <span className="manga-chip px-3 py-1 text-[11px] font-anime-pop">
                      ✦ AI-powered
                    </span>
                    <span className="manga-chip px-3 py-1 text-[11px] font-anime-pop">
                      ✦ Offline-ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature manga panels */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {[
                  {
                    title: "Flashcards",
                    desc: "Forge decks from any topic with one tap.",
                    icon: <Sparkles size={20} />,
                    bg: "linear-gradient(135deg,#ffd1dc,#ff8fa1)",
                    tag: "CARDS",
                  },
                  {
                    title: "Mock Tests",
                    desc: "Timed battles with full explanations.",
                    icon: <Zap size={20} />,
                    bg: "linear-gradient(135deg,#ffe6a1,#ffb648)",
                    tag: "TESTS",
                  },
                  {
                    title: "Formula Library",
                    desc: "Every formula, neatly catalogued.",
                    icon: <Sigma size={20} />,
                    bg: "linear-gradient(135deg,#c5f3e7,#5fe3c7)",
                    tag: "FORMULAS",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="manga-panel p-3 flex items-center gap-3 relative overflow-hidden"
                  >
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30 blur-2xl"
                      style={{ background: f.bg }} />
                    <div
                      className="size-12 rounded-2xl flex items-center justify-center text-[#15101f] border-[2.5px] border-[#15101f] shrink-0 shadow-[3px_3px_0_0_#15101f]"
                      style={{ background: f.bg }}
                    >
                      {f.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-anime-pop text-[15px] leading-tight">
                        {f.title}
                      </p>
                      <p className="text-[12px] text-secondary-fg leading-snug truncate">
                        {f.desc}
                      </p>
                    </div>
                    <span className="font-anime-pop text-[9px] tracking-widest opacity-60 shrink-0">
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
              <div className="speech-bubble inline-block px-4 py-2 mb-4">
                <p className="font-anime-pop text-[12px] tracking-widest text-[#c34dff]">
                  · INTRO ·
                </p>
              </div>
              <h1 className="font-anime-pop text-[32px] leading-[1.05] mb-1">
                Tell me about
                <br />
                yourself, friend!
              </h1>
              <p className="text-sm opacity-80 mb-6 max-w-[320px]">
                I'll tune your study plan to match your vibe and your exam.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="text-[11px] font-anime-pop tracking-widest mb-2 block">
                    YOUR NAME
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
                  <label className="text-[11px] font-anime-pop tracking-widest mb-2 block">
                    TARGET EXAM
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-2.5">
                    {["NEET", "JEE", "CUET", "Boards", "UPSC", "GATE"].map(
                      (exam) => {
                        const active = state.user.examTarget === exam;
                        return (
                          <button
                            key={exam}
                            onClick={() => updateUser({ examTarget: exam })}
                            className={`relative py-3 rounded-2xl border-[2.5px] border-[#15101f] dark:border-[#f7e9d2] font-anime-pop text-sm transition-all active:translate-x-[2px] active:translate-y-[2px] ${
                              active
                                ? "bg-[#ffd84d] shadow-[3px_3px_0_0_#15101f] dark:shadow-[3px_3px_0_0_#f7e9d2] text-[#15101f]"
                                : "bg-white/85 dark:bg-[#1f1538] shadow-[3px_3px_0_0_#15101f] dark:shadow-[3px_3px_0_0_#f7e9d2]"
                            }`}
                          >
                            {exam}
                            {active && (
                              <span className="absolute -top-2 -right-2 size-5 rounded-full bg-[#ff6b81] text-white border-2 border-[#15101f] flex items-center justify-center">
                                <Check size={11} strokeWidth={3} />
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
                  <label className="text-[11px] font-anime-pop tracking-widest mb-2 block">
                    EXAM DATE (OPTIONAL)
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
              <div className="speech-bubble inline-block px-4 py-2 mb-4">
                <p className="font-anime-pop text-[12px] tracking-widest text-[#c34dff]">
                  · STYLE ·
                </p>
              </div>
              <h1 className="font-anime-pop text-[32px] leading-[1.05] mb-1">
                Pick your vibe!
              </h1>
              <p className="text-sm opacity-80 mb-6">
                Choose a theme and an avatar that's totally you.
              </p>

              <p className="text-[11px] font-anime-pop tracking-widest mb-3">
                THEME
              </p>
              <div className="grid grid-cols-3 gap-2.5 mb-7">
                {THEMES.map((t) => {
                  const active = state.user.theme === t.id;
                  const isDark = t.mode === "dark";
                  return (
                    <button
                      key={t.id}
                      onClick={() => updateUser({ theme: t.id })}
                      className={`relative aspect-[3/4] rounded-2xl border-[2.5px] border-[#15101f] dark:border-[#f7e9d2] overflow-hidden transition-transform active:translate-x-[2px] active:translate-y-[2px] ${
                        active
                          ? "shadow-[4px_4px_0_0_#ff6b81]"
                          : "shadow-[3px_3px_0_0_#15101f] dark:shadow-[3px_3px_0_0_#f7e9d2]"
                      }`}
                      style={{ background: t.swatch }}
                    >
                      <div className="absolute inset-0 p-1.5 flex flex-col gap-1">
                        <div
                          className="h-1.5 rounded-full w-1/2"
                          style={{ background: t.accent }}
                        />
                        <div
                          className="flex-1 rounded"
                          style={{ background: t.surface }}
                        />
                        <div className="flex gap-1">
                          <div
                            className="h-1.5 flex-1 rounded-full"
                            style={{ background: t.accent }}
                          />
                          <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              background: isDark ? "#fff5" : "#0002",
                            }}
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-[#15101f]/85 py-1 px-1.5">
                        <p className="font-anime-pop text-[8.5px] tracking-wider text-white truncate text-left">
                          {t.name}
                        </p>
                      </div>
                      {active && (
                        <div className="absolute -top-1.5 -right-1.5 size-6 rounded-full bg-[#ff6b81] text-white border-2 border-[#15101f] flex items-center justify-center shadow">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] font-anime-pop tracking-widest mb-3">
                AVATAR
              </p>
              <div className="manga-panel p-4 flex items-center gap-4">
                <div className="relative size-20 rounded-2xl overflow-hidden border-[2.5px] border-[#15101f] dark:border-[#f7e9d2] shadow-[3px_3px_0_0_#15101f] dark:shadow-[3px_3px_0_0_#f7e9d2] bg-white shrink-0">
                  <img
                    src={state.user.avatar || BOT_AVATAR}
                    alt="Your avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="font-anime-pop text-[15px] leading-tight">
                    {isBotAvatar(state.user.avatar)
                      ? "Default Buddy"
                      : "Custom photo"}
                  </p>
                  <p className="text-[11px] opacity-75 leading-snug">
                    Drop your own pic, or stay with the friendly bot.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="manga-chip px-3 py-1.5 text-[11px] font-anime-pop cursor-pointer active:translate-x-[2px] active:translate-y-[2px]">
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
                        className="text-[11px] font-anime-pop underline opacity-80"
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
              <div className="flex items-center gap-3 mb-3">
                <div className="size-14 rounded-2xl border-[2.5px] border-[#15101f] dark:border-[#f7e9d2] bg-[#c34dff] text-white flex items-center justify-center shadow-[4px_4px_0_0_#15101f] dark:shadow-[4px_4px_0_0_#f7e9d2]">
                  <Bot size={26} />
                </div>
                <div className="speech-bubble px-3 py-2">
                  <p className="font-anime-pop text-[14px] leading-tight">
                    Power up time!
                  </p>
                </div>
              </div>

              <h1 className="font-anime-pop text-[32px] leading-[1.05] mb-1">
                Activate your AI
              </h1>
              <p className="text-sm opacity-80 mb-3">
                Choose a provider and add your key. You can change this anytime
                in Settings → AI.
              </p>
              <div className="manga-panel p-3 mb-5 flex items-start gap-2.5">
                <span className="font-anime-pop text-[14px] text-[#ff6b81] shrink-0">
                  ★
                </span>
                <p className="text-[12px] leading-snug opacity-90">
                  <b className="font-anime-pop">Don't know what this is? Just tap Skip ↗</b>
                  <br />
                  You can use the app fully offline without an API key — add
                  one later in Settings → AI when you want AI features.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {PROVIDERS.map((p) => {
                  const active = activeProvider === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProvider(p.id)}
                      className={`p-3 rounded-2xl border-[2.5px] border-[#15101f] dark:border-[#f7e9d2] text-left transition-transform active:translate-x-[2px] active:translate-y-[2px] ${
                        active
                          ? "bg-[#ffd84d] shadow-[3px_3px_0_0_#15101f] dark:shadow-[3px_3px_0_0_#f7e9d2]"
                          : "bg-white/85 dark:bg-[#1f1538] shadow-[3px_3px_0_0_#15101f] dark:shadow-[3px_3px_0_0_#f7e9d2]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ background: p.color }}
                        />
                        <span className="font-anime-pop text-sm">
                          {p.short}
                        </span>
                      </div>
                      <p className="text-[10px] opacity-75 leading-snug">
                        {p.hint}
                      </p>
                    </button>
                  );
                })}
              </div>

              <label className="text-[11px] font-anime-pop tracking-widest mb-2 block">
                {PROVIDERS.find((p) => p.id === activeProvider)?.short} API KEY
                {activeProvider === "gemini" ? " (OPTIONAL)" : ""}
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
                className="inline-flex items-center gap-1 text-xs font-anime-pop text-[#c34dff] mt-3"
              >
                Get a key <ExternalLink size={12} />
              </a>

              <div className="mt-6 manga-panel p-4">
                <div className="flex items-start gap-3">
                  <BookOpen size={18} className="mt-0.5 shrink-0 text-[#c34dff]" />
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
        className="relative z-10 px-5 pt-3 shrink-0 backdrop-blur-md bg-white/40 dark:bg-black/30 border-t-[2.5px] border-[#15101f] dark:border-[#f7e9d2]"
        style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + 16px)` }}
      >
        <button
          onClick={next}
          disabled={!canProceed()}
          className="anime-cta w-full h-14 rounded-2xl font-anime-pop text-base flex items-center justify-center gap-2 transition-transform disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0"
        >
          {currentStep === TOTAL_STEPS
            ? "Finish & let's go!"
            : "Continue"}
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
