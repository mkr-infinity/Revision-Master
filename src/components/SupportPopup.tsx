import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Coffee, Sparkles, Star, Flame, FileDown, Trophy, Gem } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const SUPPORT_URL = "https://supportmkr.netlify.app/";

type TriggerKey = "streak-2" | "exports-10" | "streak-30";

interface Trigger {
  key: TriggerKey;
  badgeLabel: string;
  headline: string;
  body: string;
  icon: React.ReactNode;
  gradientClass: string;
  shouldShow: (s: ReturnType<typeof useAppContext>["state"]) => boolean;
  markShown: (s: ReturnType<typeof useAppContext>["state"]) => Partial<ReturnType<typeof useAppContext>["state"]["user"]>;
}

const TRIGGERS: Trigger[] = [
  {
    key: "streak-2",
    badgeLabel: "2-day streak unlocked",
    headline: "You're on a roll!",
    body: "Two days in a row is how habits are born. Keep this going and bigger milestones are waiting just ahead.",
    icon: <Heart size={28} fill="currentColor" />,
    gradientClass: "from-violet-600 via-purple-700 to-pink-500",
    shouldShow: (s) =>
      (s.streak.current ?? 0) >= 2 &&
      (s.user.supportPromptShownStreak ?? -1) < 2,
    markShown: (s) => ({
      supportPromptShownStreak: Math.max(s.user.supportPromptShownStreak ?? 0, 2),
    }),
  },
  {
    key: "exports-10",
    badgeLabel: "10 PDF exports milestone",
    headline: "Your notes are legendary",
    body: "Exporting 10 PDFs means you are genuinely putting in the work. That deserves a proper thank-you.",
    icon: <FileDown size={28} />,
    gradientClass: "from-rose-500 via-orange-500 to-amber-400",
    shouldShow: (s) =>
      (s.user.pdfExportCount ?? 0) >= 10 &&
      (s.user.supportPromptShownAfterExports ?? -1) < 10,
    markShown: () => ({ supportPromptShownAfterExports: 10 }),
  },
  {
    key: "streak-30",
    badgeLabel: "30-day streak — legend tier",
    headline: "Legend mode unlocked",
    body: "Thirty consecutive days of study. That is elite-level discipline and exactly the kind of dedication Revision Master was built for.",
    icon: <Trophy size={28} />,
    gradientClass: "from-amber-500 via-yellow-400 to-lime-400",
    shouldShow: (s) =>
      (s.streak.current ?? 0) >= 30 &&
      !s.user.supportPromptShownAt,
    markShown: () => ({ supportPromptShownAt: new Date().toISOString() }),
  },
];

const SupportPopup: React.FC = () => {
  const { state, updateUser } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTrigger, setActiveTrigger] = useState<Trigger | null>(null);

  const nextTrigger = useMemo(
    () => TRIGGERS.find((t) => t.shouldShow(state)) ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.streak.current,
      state.user.pdfExportCount,
      state.user.supportPromptShownStreak,
      state.user.supportPromptShownAfterExports,
      state.user.supportPromptShownAt,
    ],
  );

  useEffect(() => {
    if (!nextTrigger) return;
    setActiveTrigger(nextTrigger);
    const t = setTimeout(() => setIsOpen(true), 900);
    return () => clearTimeout(t);
  }, [nextTrigger?.key]);

  const close = () => {
    setIsOpen(false);
    if (activeTrigger) {
      updateUser(activeTrigger.markShown(state) as any);
    }
  };

  const openSupport = () => {
    window.open(SUPPORT_URL, "_blank", "noopener,noreferrer");
    close();
  };

  const t = activeTrigger;

  return (
    <AnimatePresence>
      {isOpen && t && (
        <motion.div
          key="support-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-5 bg-black/60 backdrop-blur-lg"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 36 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-[32px] border border-white/10 shadow-2xl bg-[var(--bg-app)]"
          >
            {/* Close */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3.5 right-3.5 z-20 size-9 rounded-xl bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors"
            >
              <X size={17} />
            </button>

            {/* Hero gradient band */}
            <div
              className={`relative text-white px-6 pt-7 pb-8 overflow-hidden bg-gradient-to-br ${t.gradientClass}`}
            >
              {/* Glowing orbs */}
              <div className="absolute -top-12 -left-10 w-44 h-44 rounded-full bg-white/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-14 -right-8 w-48 h-48 rounded-full bg-black/25 blur-3xl pointer-events-none" />

              {/* Floating sparkles */}
              <Sparkles
                size={17}
                className="absolute top-4 right-14 text-yellow-100/80 twinkle pointer-events-none"
              />
              <Star
                size={13}
                fill="currentColor"
                className="absolute bottom-7 left-12 text-yellow-100/70 twinkle pointer-events-none"
                style={{ animationDelay: "0.7s" }}
              />
              <Sparkles
                size={13}
                className="absolute top-11 left-7 text-yellow-100/60 twinkle pointer-events-none"
                style={{ animationDelay: "1.3s" }}
              />

              {/* Content */}
              <div className="relative flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.6, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="size-16 rounded-3xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shrink-0"
                >
                  {t.icon}
                </motion.div>
                <div>
                  <p className="font-bold text-[10.5px] tracking-[0.18em] uppercase opacity-80 mb-1">
                    {t.badgeLabel}
                  </p>
                  <h2 className="font-black text-[22px] leading-tight">
                    {t.headline}
                  </h2>
                </div>
              </div>
            </div>

            {/* Stats mini-cards */}
            <div className="px-5 pt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] p-3.5">
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text-secondary)] mb-2">
                  <Flame size={13} className="text-orange-500" />
                  Day streak
                </div>
                <p className="text-[28px] font-black leading-none text-[var(--text-primary)]">
                  {state.streak.current}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] p-3.5">
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text-secondary)] mb-2">
                  <Gem size={13} className="text-violet-500" />
                  PDF exports
                </div>
                <p className="text-[28px] font-black leading-none text-[var(--text-primary)]">
                  {state.user.pdfExportCount ?? 0}
                </p>
              </div>
            </div>

            {/* Body copy */}
            <div className="px-5 pt-4 pb-5 space-y-4">
              <p className="text-[13.5px] leading-relaxed text-[var(--text-primary)]">
                {t.body}
              </p>
              <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
                Revision Master is built by one person in his free time. If it is helping you study, even a small tip keeps the AI, the polish, and the updates going.
              </p>

              <div className="flex flex-col gap-2.5 pt-1">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={openSupport}
                  className={`w-full h-12 rounded-2xl font-bold text-[14.5px] text-white flex items-center justify-center gap-2 bg-gradient-to-r ${t.gradientClass} shadow-lg`}
                >
                  <Coffee size={17} strokeWidth={2.5} />
                  Support this project
                </motion.button>
                <button
                  onClick={close}
                  className="w-full h-10 rounded-2xl text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupportPopup;
