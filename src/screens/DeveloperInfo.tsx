import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  Github,
  Instagram,
  ChevronRight,
  Settings,
  Calculator,
  Heart,
  Coins,
  ExternalLink
} from "lucide-react";
import { motion } from "motion/react";

const DeveloperInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex flex-col pb-24">
      <header className="flex items-center p-4 border-b border-primary/10 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-900 dark:text-slate-100 hover:bg-primary/10 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">
          About
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-8">
        <div className="relative group mt-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col items-center p-8 bg-white dark:bg-primary/5 border border-primary/20 rounded-xl backdrop-blur-sm">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl scale-125"></div>
              <div className="relative size-32 rounded-full border-4 border-primary p-1 bg-background-dark overflow-hidden">
                <img
                  src="https://github.com/mkr-infinity.png"
                  alt="Mohammad Kaif Raja"
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Mohammad Kaif Raja
              </h2>
              <p className="text-primary font-medium italic text-sm tracking-wide">
                "Excellence is not a gift, but a skill that takes practice."
              </p>
              <div className="pt-4 px-6 italic text-slate-500 dark:text-slate-400">
                "A normal person from India"
              </div>
            </div>

            <div className="mt-8 flex gap-4 w-full">
              <div className="flex-1 p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <span className="block text-xl font-bold">12+</span>
                <span className="text-xs uppercase tracking-widest opacity-60">
                  Projects
                </span>
              </div>
              <div className="flex-1 p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <span className="block text-xl font-bold">500+</span>
                <span className="text-xs uppercase tracking-widest opacity-60">
                  Commits
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 px-2">
            Connect & Explore
          </h3>

          <a
            href="https://mkr-infinity.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white dark:bg-primary/5 hover:bg-primary/10 border border-primary/10 p-4 rounded-xl transition-all group"
          >
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <Globe size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium">Official Website</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                mkr-infinity.github.io
              </p>
            </div>
            <ChevronRight
              size={20}
              className="text-primary group-hover:translate-x-1 transition-transform"
            />
          </a>

          <a
            href="https://github.com/mkr-infinity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white dark:bg-primary/5 hover:bg-primary/10 border border-primary/10 p-4 rounded-xl transition-all group"
          >
            <div className="size-10 rounded-lg bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white">
              <Github size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium">GitHub Profile</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                View source code & contributions
              </p>
            </div>
            <ChevronRight
              size={20}
              className="text-primary group-hover:translate-x-1 transition-transform"
            />
          </a>

          <a
            href="https://www.instagram.com/mkr_infinity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white dark:bg-primary/5 hover:bg-primary/10 border border-primary/10 p-4 rounded-xl transition-all group"
          >
            <div className="size-10 rounded-lg bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center text-white">
              <Instagram size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium">Instagram</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                @mkr_infinity
              </p>
            </div>
            <ChevronRight
              size={20}
              className="text-primary group-hover:translate-x-1 transition-transform"
            />
          </a>
        </section>

        <section className="space-y-3 mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 px-2">
            Other Apps for Students
          </h3>
          <a
            href="https://github.com/mkr-infinity/Matrix_Calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white dark:bg-primary/5 hover:bg-primary/10 border border-primary/10 p-4 rounded-xl transition-all group"
          >
            <div className="size-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
              <Calculator size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium">Matrix Solver</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Advanced matrix calculations & operations
              </p>
            </div>
            <ChevronRight
              size={20}
              className="text-primary group-hover:translate-x-1 transition-transform"
            />
          </a>
        </section>

        <section className="space-y-3 mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 px-2">
            Support Me
          </h3>
          <motion.a
            href="https://supportmkr.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden flex items-center gap-4 bg-gradient-to-br from-primary/20 via-purple-500/10 to-blue-500/20 border border-primary/20 p-5 rounded-2xl transition-all group shadow-lg shadow-primary/5"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 size-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
            
            <div className="relative size-12 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white shadow-md">
              <Heart size={24} className="group-hover:scale-110 transition-transform" fill="currentColor" />
            </div>
            
            <div className="relative flex-1">
              <p className="font-bold text-lg">Support My Work</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Support via Crypto & Web3 to keep this project alive
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  <Coins size={10} /> Web3 Enabled
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full">
                  Creative Support
                </span>
              </div>
            </div>
            
            <div className="relative size-10 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <ExternalLink size={18} />
            </div>
          </motion.a>
        </section>

        <section className="space-y-3 mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 px-2">
            About Revision Master
          </h3>
          <div className="bg-white dark:bg-primary/5 border border-primary/10 p-5 rounded-xl space-y-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-primary">Revision Master</span> is a privacy-focused, offline-first study companion designed to enhance learning through active recall and spaced repetition. Created by <span className="font-bold text-primary">Mohammad Kaif Raja</span>.
              </p>
            </div>
            <div className="h-px bg-primary/10 w-full"></div>
            <div>
              <h4 className="font-bold text-primary mb-2">Key Features</h4>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4">
                <li><span className="font-semibold text-slate-800 dark:text-slate-100">Unlimited Flashcards:</span> Create custom decks without limits.</li>
                <li><span className="font-semibold text-slate-800 dark:text-slate-100">MKR Ai:</span> Generate flashcards instantly using AI.</li>
                <li><span className="font-semibold text-slate-800 dark:text-slate-100">Offline Mock Tests:</span> Test your knowledge anywhere.</li>
                <li><span className="font-semibold text-slate-800 dark:text-slate-100">Focus Timer:</span> Customizable Pomodoro timer.</li>
                <li><span className="font-semibold text-slate-800 dark:text-slate-100">Privacy First:</span> All data stays on your device.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="py-10 text-center">
        </div>
      </main>
    </div>
  );
};

export default DeveloperInfo;
