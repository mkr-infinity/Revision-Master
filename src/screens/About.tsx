import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  Github,
  Instagram,
  ChevronRight,
  Heart,
  Wallet,
  Calculator,
  BookOpen,
  Repeat,
  Sparkles,
  FileText,
  LineChart,
  Palette
} from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="font-display text-slate-900 dark:text-slate-100 flex flex-col pb-24 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] -left-20 size-64 bg-primary/10 rounded-[3rem] blur-3xl opacity-30"></div>
        <div className="absolute bottom-[20%] -right-20 size-80 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
        {/* Floating Glass Blocks */}
        <div className="absolute top-1/4 right-10 size-12 bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl rotate-12"></div>
        <div className="absolute bottom-1/3 left-10 size-16 bg-primary/5 border border-primary/10 backdrop-blur-sm rounded-2xl -rotate-12"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--color-primary),0.05)_0%,transparent_70%)]" />
      </div>

      <header className="flex items-center p-4 border-b border-primary/10 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="text-slate-900 dark:text-slate-100 hover:bg-primary/10 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </motion.button>
        <h1 className="text-lg font-bold flex-1 text-center">
          About
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-10 relative z-10">
        <div className="relative group mt-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center gap-5 p-6 bg-white/40 dark:bg-primary/5 border border-primary/20 rounded-3xl backdrop-blur-xl shadow-xl overflow-hidden">
            {/* Inner Glass Effect Blocks */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="absolute top-4 left-4 size-12 bg-white/10 rounded-lg rotate-12 blur-sm"></div>
              <div className="absolute bottom-10 right-4 size-16 bg-primary/10 rounded-full -rotate-12 blur-md"></div>
            </div>

            <div className="relative shrink-0 z-10">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg scale-110"></div>
              <div className="relative size-20 sm:size-24 rounded-full border-2 border-primary p-0.5 bg-background-dark overflow-hidden shadow-[0_0_20px_rgba(var(--color-primary),0.3)]">
                <img
                  src="https://github.com/mkr-infinity.png"
                  alt="Mohammad Kaif Raja"
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="flex-1 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-signature text-primary tracking-wide drop-shadow-sm mb-2">
                Mohammad Kaif Raja
              </h2>
              <p className="text-primary font-bold italic text-xs sm:text-sm tracking-wide bg-primary/10 px-3 py-1.5 rounded-2xl inline-block border border-primary/10 leading-snug">
                "Excellence is a skill that takes practice."
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-4">
            Connect & Explore
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {[
              { href: "https://mkr-infinity.github.io", icon: Globe, label: "Official Website", sub: "mkr-infinity.github.io", color: "from-blue-600 to-cyan-500" },
              { href: "https://github.com/mkr-infinity", icon: Github, label: "GitHub Profile", sub: "View source code", color: "from-slate-900 to-slate-700" },
              { href: "https://www.instagram.com/mkr_infinity", icon: Instagram, label: "Instagram", sub: "@mkr_infinity", color: "from-purple-600 via-pink-500 to-orange-500" }
            ].map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 bg-white/40 dark:bg-primary/5 hover:bg-primary/10 border border-primary/10 p-5 rounded-[2.5rem] transition-all group backdrop-blur-md shadow-sm"
              >
                <div className={`size-14 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <link.icon size={28} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{link.label}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {link.sub}
                  </p>
                </div>
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-4">
            Support My Work
          </h3>
          <motion.a 
            whileTap={{ scale: 0.95 }}
            href="https://supportmkr.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative overflow-hidden rounded-[3rem] p-10 text-center border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-transparent shadow-[0_0_40px_rgba(244,63,94,0.15)] group block"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-xl shadow-rose-500/30 mb-6 group-hover:scale-110 transition-transform">
                <Heart size={36} className="text-white fill-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">Fuel the Development</h3>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-400 mb-8 max-w-xs mx-auto leading-relaxed opacity-80">
                Revision Master is built with passion. Your support keeps the servers running and the app ad-free!
              </p>
              <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black py-4 px-12 rounded-full transition-all shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:shadow-[0_0_35px_rgba(244,63,94,0.7)] uppercase text-sm tracking-widest">
                Support Me
              </div>
            </div>
          </motion.a>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-4">
            Explore Other Apps
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <motion.a
              href="https://github.com/mkr-infinity/Solo-Ledger"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-[3rem] p-8 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent backdrop-blur-md shadow-lg"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors"></div>
              <div className="flex items-start gap-5 relative z-10">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform shrink-0">
                  <Wallet size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1">Solo Ledger</h4>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">Budget Tracking App</p>
                  <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed opacity-80">
                    Master your finances with precision. Track expenses, set budgets, and visualize your wealth.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end text-emerald-500 font-black text-xs uppercase tracking-widest gap-2">
                Launch App <ChevronRight size={14} />
              </div>
            </motion.a>

            <motion.a
              href="https://github.com/mkr-infinity/Matrix_Calculator"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-[3rem] p-8 border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent backdrop-blur-md shadow-lg"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors"></div>
              <div className="flex items-start gap-5 relative z-10">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform shrink-0">
                  <Calculator size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1">Matrix Calculator</h4>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Matrix Calculation App</p>
                  <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed opacity-80">
                    Solve complex linear algebra problems instantly. Determinants, inverses, and more.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end text-indigo-500 font-black text-xs uppercase tracking-widest gap-2">
                Launch App <ChevronRight size={14} />
              </div>
            </motion.a>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-4">
            App Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: BookOpen, title: "Smart Organization", desc: "Structure your study with subjects, units, and topics." },
              { icon: Repeat, title: "Revision Tracking", desc: "Track 1st to 4th revisions with visual indicators." },
              { icon: Sparkles, title: "AI Generation", desc: "Instantly create flashcards & formulas using AI." },
              { icon: FileText, title: "PDF Export", desc: "Export your flashcard decks as printable PDFs." },
              { icon: LineChart, title: "Analytics & Streaks", desc: "Monitor your progress and maintain daily streaks." },
              { icon: Palette, title: "Customization", desc: "Personalize with themes, avatars, and custom API keys." }
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white/40 dark:bg-primary/5 border border-primary/10 rounded-[2rem] backdrop-blur-md shadow-sm hover:bg-primary/5 transition-colors">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                  <feature.icon size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{feature.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="py-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Designed for the Future</p>
        </div>
      </main>
    </motion.div>
  );
};

export default About;
