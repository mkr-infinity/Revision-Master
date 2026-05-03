import React, { useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  Github,
  Instagram,
  Send,
  ChevronRight,
  Coffee,
  Wallet,
  Calculator,
} from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollAppToTop = () => {
    const scroller = document.querySelector("main");
    if (scroller instanceof HTMLElement) {
      scroller.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    window.scrollTo(0, 0);
  };

  useLayoutEffect(() => {
    scrollAppToTop();
  }, []);

  useEffect(() => {
    const state = location.state as { scrollToTop?: boolean } | null;
    if (state?.scrollToTop) {
      scrollAppToTop();
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

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

      <header
        className="sticky top-0 z-50 px-4 pb-2.5"
        style={{ paddingTop: `calc(env(safe-area-inset-top) + 6px)` }}
      >
        <div className="flex items-center gap-3 backdrop-blur-xl bg-elevated/60 border border-white/[0.08] shadow-md shadow-black/10 rounded-[1.35rem] px-3.5 py-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="size-10 rounded-2xl bg-white/35 dark:bg-white/8 border border-white/[0.10] shadow-sm flex items-center justify-center text-slate-900 dark:text-slate-100 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <div className="flex-1 text-center">
            <h1 className="font-bold text-lg text-primary-fg">
              About
            </h1>
          </div>
          <div className="size-10" />
        </div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-8 relative z-10">
        <section className="relative group mt-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-violet-500 to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-700"></div>
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-white/55 dark:bg-primary/8 backdrop-blur-2xl shadow-xl">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(124,77,255,0.16),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_34%)]" />
            <div className="relative p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-primary/25 rounded-full blur-xl scale-110"></div>
                  <div className="relative size-20 sm:size-24 rounded-full border-2 border-primary p-0.5 bg-background-dark overflow-hidden shadow-[0_0_24px_rgba(var(--color-primary),0.28)]">
                    <img
                      src="https://github.com/mkr-infinity.png"
                      alt="Mohammad Kaif Raja"
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/15 mb-3">
                    Developer profile
                  </div>
                  <h2 className="text-3xl sm:text-[2.5rem] font-black leading-tight text-primary-fg mb-2">
                    Mohammad Kaif Raja
                  </h2>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-secondary-fg max-w-[26rem]">
                    I build anime-inspired tools that help students revise faster, stay consistent, and actually enjoy the process.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {[
                  "React Native feel",
                  "Capacitor APK",
                  "AI study tools",
                  "Offline-friendly",
                ].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-full bg-surface-2/90 border border-subtle text-[10px] font-bold uppercase tracking-wider text-secondary-fg"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2.5">
                {[
                  { label: "Focus", value: "Study UX" },
                  { label: "Stack", value: "React + Capacitor" },
                  { label: "Style", value: "Anime-inspired" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-subtle bg-surface-2/80 px-3 py-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-tertiary-fg">{stat.label}</p>
                    <p className="mt-1 text-[11px] font-bold leading-snug text-primary-fg">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3.5">
                <p className="text-sm italic text-primary-fg leading-relaxed">
                  “Excellence is a skill that takes practice.”
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-4">
            Connect & Explore
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {[
              { href: "https://mkr-infinity.github.io", icon: Globe, label: "Official Website", sub: "mkr-infinity.github.io", color: "from-blue-600 to-cyan-500" },
              { href: "https://github.com/mkr-infinity", icon: Github, label: "GitHub Profile", sub: "View source code", color: "from-slate-900 to-slate-700" },
              { href: "https://t.me/mkr_infinity", icon: Send, label: "Telegram", sub: "@mkr_infinity", color: "from-sky-500 to-blue-600" },
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
            whileTap={{ scale: 0.97 }}
            href="https://buymeacoffee.com/mkr_infinity"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-4 rounded-[2rem] p-4 border border-amber-500/30 bg-gradient-to-r from-amber-500/12 via-orange-500/6 to-transparent shadow-[0_16px_36px_-22px_rgba(245,158,11,0.75)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute right-0 top-0 bottom-0 w-28 pointer-events-none opacity-90" style={{ background: "radial-gradient(ellipse at right center, rgba(251,146,60,0.16), transparent 72%)" }} />
            <div className="size-12 rounded-[1.15rem] bg-gradient-to-tr from-amber-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0 group-hover:scale-105 transition-transform">
              <Coffee size={22} className="text-white" strokeWidth={2.4} />
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <p className="font-black text-sm leading-tight">Buy me a coffee</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Support future features and updates
              </p>
            </div>
            <div className="size-9 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
              <ChevronRight size={18} />
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

        <div className="py-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Designed for the Future</p>
        </div>
      </main>
    </motion.div>
  );
};

export default About;
