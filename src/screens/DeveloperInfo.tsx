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
  Sparkles,
  CheckCircle2,
  Heart,
  Coins,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";

const DeveloperInfo = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex flex-col pb-24 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            rotate: [0, 90, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -left-20 size-64 bg-primary/10 rounded-[3rem] blur-3xl opacity-30"
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 0], 
            y: [0, 100, 0],
            rotate: [0, -45, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] -right-20 size-80 bg-blue-500/10 rounded-full blur-3xl opacity-30"
        />
        {/* Floating Glass Blocks */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-10 size-12 bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl rotate-12"
        />
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 left-10 size-16 bg-primary/5 border border-primary/10 backdrop-blur-sm rounded-2xl -rotate-12"
        />
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
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col items-center p-8 bg-white/40 dark:bg-primary/5 border border-primary/20 rounded-[3rem] backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Inner Glass Effect Blocks */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              <motion.div 
                animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-4 left-4 size-12 bg-white/10 rounded-lg rotate-12 blur-sm"
              ></motion.div>
              <motion.div 
                animate={{ x: [20, -20, 20], y: [10, -10, 10] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-10 right-4 size-16 bg-primary/10 rounded-full -rotate-12 blur-md"
              ></motion.div>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl scale-125"></div>
              <div className="relative size-32 rounded-full border-4 border-primary p-1 bg-background-dark overflow-hidden shadow-[0_0_30px_rgba(var(--color-primary),0.4)]">
                <img
                  src="https://github.com/mkr-infinity.png"
                  alt="Mohammad Kaif Raja"
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="text-center space-y-2 relative z-10">
              <h2 className="text-5xl font-signature text-primary tracking-wide drop-shadow-sm">
                Mohammad Kaif Raja
              </h2>
              <p className="text-primary font-bold italic text-sm tracking-wide bg-primary/10 px-4 py-1.5 rounded-full inline-block border border-primary/10">
                "Excellence is a skill that takes practice."
              </p>
            </div>

            <div className="mt-8 flex gap-4 w-full relative z-10">
              <div className="flex-1 p-5 rounded-[2rem] bg-white/50 dark:bg-primary/10 border border-primary/20 text-center backdrop-blur-md shadow-inner">
                <span className="block text-2xl font-black text-primary">12+</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  Projects
                </span>
              </div>
              <div className="flex-1 p-5 rounded-[2rem] bg-white/50 dark:bg-primary/10 border border-primary/20 text-center backdrop-blur-md shadow-inner">
                <span className="block text-2xl font-black text-primary">500+</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  Commits
                </span>
              </div>
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
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-8 max-w-xs mx-auto leading-relaxed opacity-80">
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
            About Revision Master
          </h3>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-teal-400 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white/40 dark:bg-primary/5 border border-primary/20 p-10 rounded-[3rem] backdrop-blur-2xl overflow-hidden shadow-2xl">
              <div className="absolute -top-20 -right-20 size-64 bg-primary/10 rounded-full blur-[80px]"></div>
              <div className="absolute -bottom-20 -left-20 size-64 bg-teal-500/10 rounded-full blur-[80px]"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white shadow-xl shadow-primary/30">
                    <Sparkles size={30} />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Future</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mt-1">Of Learning</p>
                  </div>
                </div>

                <p className="text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-black text-primary">Revision Master</span> is a privacy-focused, offline-first study companion designed to enhance learning through active recall and spaced repetition.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: "AI-Powered Flashcards", icon: Sparkles },
                    { label: "Offline Mock Tests", icon: CheckCircle2 },
                    { label: "Privacy-First Design", icon: CheckCircle2 },
                    { label: "Focus Analytics", icon: CheckCircle2 }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/50 dark:bg-primary/10 p-4 rounded-[1.5rem] border border-primary/10 backdrop-blur-sm">
                      <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                        <feature.icon size={16} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest opacity-90">{feature.label}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-primary/20 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Build Version</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">1.0.0 Stable</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Developed By</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">MKR Infinity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="py-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Designed for the Future</p>
        </div>
      </main>
    </motion.div>
  );
};

export default DeveloperInfo;
