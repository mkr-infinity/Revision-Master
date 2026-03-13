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
import { useAppContext, Theme } from "../context/AppContext";

import avatar1 from '../assets/avatar1.svg';
import avatar2 from '../assets/avatar2.svg';
import avatar3 from '../assets/avatar3.svg';
import avatar4 from '../assets/avatar4.svg';
import avatar5 from '../assets/avatar5.svg';
import avatar6 from '../assets/avatar6.svg';

const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
];

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
  const totalSteps = 5;

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
      className="min-h-screen flex flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display"
    >
      <div className="flex items-center p-4 justify-between">
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

      <div className="flex flex-col gap-3 p-6">
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

      <div className="flex-1 px-6 pt-4 pb-8 flex flex-col">
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
            <div className="text-center mb-10 flex flex-col items-center">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <GraduationCap size={40} />
              </div>
              <h1 className="text-3xl font-bold leading-tight mb-2">
                Who are you?
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">
                Let's personalize your revision journey.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter Name
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
                <label className="block text-sm font-medium mb-2">
                  Enter Age
                </label>
                <input
                  type="number"
                  value={state.user.age}
                  onChange={(e) => updateUser({ age: e.target.value })}
                  placeholder="Your age"
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="mt-auto pt-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={!state.user.name}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-[0_8px_30px_rgb(127,19,236,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
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
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold leading-tight mb-2">
                Select Your Target
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">
                Which exam are we mastering today?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["NEET", "JEE", "CUET", "Boards"].map((exam) => (
                <div
                  key={exam}
                  onClick={() => updateUser({ examTarget: exam })}
                  className={`relative group cursor-pointer border-2 rounded-xl transition-all ${state.user.examTarget === exam ? "border-primary bg-primary/10" : "border-transparent bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10"}`}
                >
                  <div className="relative flex flex-col items-center justify-center p-6">
                    <span className="text-lg font-bold">{exam}</span>
                    {state.user.examTarget === exam && (
                      <div className="absolute top-2 right-2">
                        <Check size={16} className="text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="col-span-2 mt-2">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">
                  Other / Custom Exam
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={
                      !["NEET", "JEE", "CUET", "Boards"].includes(
                        state.user.examTarget,
                      )
                        ? state.user.examTarget
                        : ""
                    }
                    onChange={(e) => updateUser({ examTarget: e.target.value })}
                    placeholder="e.g. GATE, SAT, UPSC..."
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40">
                    <Edit2 size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={!state.user.examTarget}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-[0_8px_30px_rgb(127,19,236,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold leading-tight mb-2">
                Final Touches
              </h1>
            </div>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="text-primary" size={20} />
                <h2 className="text-lg font-bold">Choose Your Theme</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {themes.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => updateUser({ theme: t.id })}
                    className="relative group cursor-pointer"
                  >
                    <div
                      className={`aspect-[4/3] rounded-xl border-2 p-3 flex flex-col justify-between overflow-hidden ${t.colors} ${state.user.theme === t.id ? "border-primary ring-2 ring-primary/20" : "border-slate-200 dark:border-white/10"}`}
                    >
                      {state.user.theme === t.id && (
                        <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium text-center ${state.user.theme === t.id ? "text-primary font-bold" : ""}`}
                    >
                      {t.name}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UserCircle className="text-primary" size={20} />
                  <h2 className="text-lg font-bold">Pick Your Avatar</h2>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                {avatars.map((avatar, idx) => (
                  <div
                    key={idx}
                    onClick={() => updateUser({ avatar })}
                    className={`flex-none w-24 h-24 rounded-full border-2 p-1 cursor-pointer relative ${state.user.avatar === avatar ? "bg-primary/20 border-primary" : "bg-primary/5 border-transparent"}`}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${idx + 1}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                    {state.user.avatar === avatar && (
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-background-dark">
                        <Check size={14} />
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
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(127,19,236,0.4)] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Continue</span>
                <ArrowLeft
                  size={18}
                  className="rotate-180 group-hover:translate-x-1 transition-transform"
                />
              </motion.button>
              <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-4">
                You can change these preferences anytime in settings.
              </p>
            </div>
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div 
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="size-32 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-8 relative"
            >
              <Rocket size={64} className="relative z-10" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-primary/20 rounded-full"
              />
            </motion.div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mb-4"
            >
              You're Ready!
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-500 dark:text-slate-400 text-lg mb-12 max-w-[280px]"
            >
              Welcome to Revision Master. Let's start your journey to excellence.
            </motion.p>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_10px_40px_rgba(127,19,236,0.4)] hover:brightness-110 transition-all"
            >
              Enter Dashboard
            </motion.button>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Onboarding;
