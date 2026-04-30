import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Coffee, Sparkles, Star } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const SUPPORT_URL = "https://supportmkr.netlify.app/";
const TRIGGER_STREAK = 2;

const SupportPopup: React.FC = () => {
  const { state, updateUser } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const current = state.streak.current;
    const lastShown = state.user.supportPromptShownStreak ?? null;
    if (current >= TRIGGER_STREAK && lastShown !== current) {
      const t = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, [state.streak.current, state.user.supportPromptShownStreak]);

  const close = () => {
    setIsOpen(false);
    updateUser({ supportPromptShownStreak: state.streak.current });
  };

  const openSupport = () => {
    window.open(SUPPORT_URL, "_blank", "noopener,noreferrer");
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="support-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-5 bg-black/55 backdrop-blur-md"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm anime-modal anime-aura overflow-hidden"
          >
            {/* Close */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 z-20 size-9 rounded-xl bg-app/80 hover:bg-app text-secondary-fg flex items-center justify-center border border-subtle"
            >
              <X size={18} />
            </button>

            {/* Hero band */}
            <div className="relative gradient-violet text-white p-6 pb-7 overflow-hidden">
              <div className="absolute -top-10 -left-8 w-40 h-40 rounded-full bg-white/15 blur-3xl" />
              <div className="absolute -bottom-12 -right-6 w-44 h-44 rounded-full bg-black/25 blur-3xl" />

              {/* sparkles */}
              <Sparkles
                size={18}
                className="absolute top-4 right-14 text-yellow-200 twinkle"
              />
              <Star
                size={14}
                className="absolute bottom-6 left-10 text-yellow-200 twinkle"
                fill="currentColor"
                style={{ animationDelay: "0.7s" }}
              />
              <Sparkles
                size={14}
                className="absolute top-10 left-6 text-yellow-200 twinkle"
                style={{ animationDelay: "1.2s" }}
              />

              <div className="relative flex items-center gap-3">
                <div className="size-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center anime-aura">
                  <Heart size={28} fill="currentColor" />
                </div>
                <div>
                  <p className="font-anime-pop text-[11px] tracking-[0.2em] opacity-85">
                    {state.streak.current}-DAY STREAK · LEGEND IN THE MAKING
                  </p>
                  <h2 className="font-anime-pop text-2xl leading-tight mt-0.5">
                    You're amazing!
                  </h2>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 pt-4 space-y-4">
              <p className="text-[14px] leading-relaxed text-primary-fg">
                Two whole days in a row — that's hero-grade dedication.
                Revision Master is built and maintained by one person, in his
                free time, with a lot of caffeine.
              </p>
              <p className="text-[14px] leading-relaxed text-secondary-fg">
                If the app is helping you study, a small tip keeps the lights
                on, the AI calls flowing, and new features shipping. No
                pressure — your streak is celebration enough.
              </p>

              <div className="flex flex-col gap-2.5 pt-1">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={openSupport}
                  className="w-full anime-cta anime-aura h-12 rounded-2xl font-anime-pop text-[15px] flex items-center justify-center gap-2"
                >
                  <Coffee size={18} strokeWidth={2.5} />
                  Support me
                </motion.button>
                <button
                  onClick={close}
                  className="w-full h-11 rounded-2xl text-sm font-bold text-secondary-fg hover:bg-surface-2 transition-colors"
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
