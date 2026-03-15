import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Edit2,
  Rocket,
  Palette,
  UserCircle,
  Check,
  Zap,
  BookOpen,
  Trophy,
  BrainCircuit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext, Theme, AVATARS } from "../context/AppContext";

const themes: { id: Theme; name: string; colors: string }[] = [
  { id: "light", name: "Light", colors: "bg-white border-slate-200" },
  { id: "dark", name: "Dark", colors: "bg-slate-900 border-primary" },
  { id: "neon", name: "Neon", colors: "bg-black border-fuchsia-500" },
  { id: "green", name: "Green", colors: "bg-[#0a1a0a] border-emerald-500" },
];

const Onboarding = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const { state, updateUser } = useAppContext();

  const currentStep = parseInt(step || "1", 10);
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      navigate(`/onboarding/${currentStep + 1}`);
    } else {
      updateUser({ onboardingCompleted: true });
      navigate("/");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/onboarding/${currentStep - 1}`);
    }
  };

  const handleSkip = () => {
    updateUser({
      name: state.user.name || "Scholar",
      age: state.user.age || "18",
      examTarget: state.user.examTarget || "General",
      onboardingCompleted: true,
    });
    navigate("/");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="h-screen flex flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display overflow-hidden"
    >
      <div className="flex items-center p-4 justify-between shrink-0">
        {currentStep > 1 ? (
          <button
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="size-10"></div>
        )}
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          Revision Master
        </h2>
        {currentStep < totalSteps ? (
          <button
            onClick={handleSkip}
            className="text-sm font-bold text-primary hover:text-primary/80 transition-colors px-2"
          >
            Skip
          </button>
        ) : (
          <div className="w-12"></div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-6 shrink-0">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
            Onboarding Progress
          </p>
          <p className="text-primary text-sm font-bold">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(127,19,236,0.6)] transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-12 scroll-smooth">
        <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-10 flex flex-col items-center">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <BrainCircuit size={40} />
              </div>
              <h1 className="text-3xl font-bold leading-tight mb-2">
                Master Your Exams
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base max-w-[280px] mx-auto">
                The ultimate companion for competitive exam preparation.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Flashcards</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Generate smart cards from any topic using Gemini AI.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Mock Tests</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Simulate real exam environments with timed tests.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Formula Library</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Quick access to all essential formulas and concepts.</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-[0_8px_30px_rgb(127,19,236,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-8 flex flex-col items-center">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <GraduationCap size={32} />
              </div>
              <h1 className="text-2xl font-bold leading-tight mb-1">
                Personalize Your Profile
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Tell us about your goals.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  What's your name?
                </label>
                <input
                  type="text"
                  value={state.user.name}
                  onChange={(e) => updateUser({ name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Target Exam
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {["NEET", "JEE", "CUET", "Boards"].map((exam) => (
                    <div
                      key={exam}
                      onClick={() => updateUser({ examTarget: exam })}
                      className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${state.user.examTarget === exam ? "border-primary bg-primary/10 text-primary" : "border-slate-100 dark:border-white/5 bg-white dark:bg-white/5"}`}
                    >
                      <span className="text-sm font-bold">{exam}</span>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={!["NEET", "JEE", "CUET", "Boards"].includes(state.user.examTarget) ? state.user.examTarget : ""}
                  onChange={(e) => updateUser({ examTarget: e.target.value })}
                  placeholder="Other Exam (e.g. UPSC, SAT)"
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={state.user.examDate || ""}
                  onChange={(e) => updateUser({ examDate: e.target.value })}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="mt-auto pt-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={!state.user.name || !state.user.examTarget}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-[0_8px_30px_rgb(127,19,236,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold leading-tight mb-1">
                Style Your Experience
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Choose your vibe and avatar.
              </p>
            </div>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="text-primary" size={18} />
                <h2 className="text-base font-bold">Theme</h2>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {themes.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => updateUser({ theme: t.id })}
                    className={`aspect-square rounded-xl border-2 cursor-pointer transition-all ${t.colors} ${state.user.theme === t.id ? "border-primary ring-2 ring-primary/20" : "border-slate-100 dark:border-white/5"}`}
                  >
                    {state.user.theme === t.id && (
                      <div className="flex items-center justify-center h-full">
                        <Check size={16} className="text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <UserCircle className="text-primary" size={18} />
                <h2 className="text-base font-bold">Avatar</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
                {AVATARS.map((avatar) => (
                  <div
                    key={avatar.id}
                    onClick={() => updateUser({ avatar: avatar.src })}
                    className={`flex-none w-16 h-16 rounded-full border-2 p-0.5 cursor-pointer relative transition-all ${state.user.avatar === avatar.src ? "border-primary ring-2 ring-primary/20" : "border-transparent"}`}
                  >
                    <img
                      src={avatar.src}
                      alt={avatar.name}
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {state.user.avatar === avatar.src && (
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-background-dark">
                        <Check size={10} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-auto pt-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-[0_10px_30px_rgba(127,19,236,0.4)] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Finish & Start Learning</span>
                <Rocket size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-4">
                You're all set! Welcome to Revision Master.
              </p>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Onboarding;
