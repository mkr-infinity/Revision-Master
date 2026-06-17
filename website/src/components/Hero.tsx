import { motion } from "framer-motion";
import {
  Download,
  Github,
  Sparkles,
  Timer,
  Trophy,
  ChevronDown,
} from "lucide-react";
import homeImg from "@assets/home_1777901812087.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Hero-local readability gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/35 to-transparent dark:from-[#030408]/85 dark:via-[#030408]/40 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Radial speed lines */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg at 50% 105%, transparent 0deg 7deg, rgba(139,92,246,1) 7.5deg 7.8deg)",
        }}
      />

      {/* Scan line (dark only) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block opacity-40">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          animate={{ y: ["-100vh", "100vh"] }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "linear",
            repeatDelay: 4,
          }}
        />
      </div>

      <div className="container mx-auto px-5 md:px-8 pt-24 pb-16 relative z-10 w-full">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 xl:gap-16 items-center max-w-7xl mx-auto">
          {/* ── LEFT: Text Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex flex-col gap-6 lg:gap-7"
          >
            {/* Version badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex items-center gap-2.5 w-fit"
            >
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/8 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-xs font-bold font-display tracking-widest uppercase text-primary">
                  Version 2.0.1 — Anime Edition
                </span>
              </div>
            </motion.div>

            {/* Main heading — cinematic scale */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="font-display font-bold leading-[0.9] tracking-[-0.01em] text-foreground"
                style={{ fontSize: "clamp(3.8rem, 9.5vw, 7.5rem)" }}
              >
                Study
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="font-display font-bold leading-[0.9] tracking-[-0.01em]"
                style={{
                  fontSize: "clamp(3.8rem, 9.5vw, 7.5rem)",
                  background:
                    "linear-gradient(120deg, #8B5CF6 0%, #22D3EE 55%, #F472B6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Smarter.
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.8 }}
                className="font-display font-bold leading-[0.9] tracking-[-0.01em]"
                style={{
                  fontSize: "clamp(3.8rem, 9.5vw, 7.5rem)",
                  background:
                    "linear-gradient(120deg, #F97316 0%, #F472B6 50%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 24px rgba(249,115,22,0.25))",
                }}
              >
                Score Higher.
              </motion.h1>
            </div>

            {/* Accent divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center gap-2 origin-left"
            >
              <div className="h-[3px] w-14 bg-gradient-to-r from-primary to-secondary rounded-full" />
              <div className="h-[3px] w-6 bg-primary/35 rounded-full" />
              <div className="h-[3px] w-2 bg-primary/15 rounded-full" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-base md:text-lg text-foreground/70 dark:text-foreground/60 max-w-lg leading-relaxed font-medium"
            >
              Your ultimate anime study companion. Generate AI flashcards, run
              mock tests, and master formulas — immerse yourself in a world that
              makes learning addictive.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.82, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="https://github.com/mkr-infinity/Revision-Master/releases/latest/"
                target="_blank"
                rel="noreferrer"
              >
                <button
                  className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold font-display text-sm tracking-widest uppercase text-white transition-all hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
                    boxShadow:
                      "0 0 24px rgba(139,92,246,0.5), 0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  <Download size={16} className="group-hover:animate-bounce" />
                  Download APK
                </button>
              </a>
              <a
                href="https://github.com/mkr-infinity/Revision-Master"
                target="_blank"
                rel="noreferrer"
              >
                <button className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold font-display text-sm tracking-widest uppercase transition-all hover:scale-[1.03] active:scale-[0.97] border border-foreground/20 bg-background/20 backdrop-blur-sm hover:bg-background/35 hover:border-primary/40 text-foreground">
                  <Github size={16} />
                  GitHub
                </button>
              </a>
            </motion.div>

            {/* Stat chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap gap-2.5 mt-1"
            >
              {[
                { icon: Sparkles, label: "AI Generated", color: "#22D3EE" },
                { icon: Timer, label: "Focus Timer", color: "#8B5CF6" },
                { icon: Trophy, label: "Score Track", color: "#F472B6" },
              ].map((chip, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold font-display tracking-wide text-foreground/75 dark:text-foreground/65 border border-white/10 dark:border-white/8 bg-background/20 backdrop-blur-sm"
                >
                  <chip.icon size={12} style={{ color: chip.color }} />
                  {chip.label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Phone Mockup ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
            className="relative mx-auto lg:mx-0 w-full max-w-[260px] md:max-w-[300px] lg:max-w-[340px]"
          >
            {/* Outer energy halos */}
            <div className="absolute inset-[-20%] rounded-full blur-[100px] bg-gradient-to-tr from-primary/25 via-secondary/10 to-accent/20 ki-pulse" />
            <div
              className="absolute inset-[-8%] rounded-[3rem] blur-[50px] bg-primary/12 ki-pulse"
              style={{ animationDelay: "1.5s" }}
            />

            {/* Manga corner marks */}
            {[
              "top-0 left-0 border-l-2 border-t-2",
              "top-0 right-0 border-r-2 border-t-2",
              "bottom-0 left-0 border-l-2 border-b-2",
              "bottom-0 right-0 border-r-2 border-b-2",
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute -m-3 w-7 h-7 border-primary/50 ${cls}`}
              />
            ))}

            {/* Phone body */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{
                repeat: Infinity,
                duration: 5.5,
                ease: "easeInOut",
              }}
              className="relative w-full aspect-[9/18.5] rounded-[2.5rem] overflow-hidden z-10"
              style={{
                border: "6px solid rgba(139,92,246,0.25)",
                boxShadow:
                  "0 35px 90px rgba(139,92,246,0.3), 0 10px 30px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.07)",
                background: "hsl(var(--card))",
              }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-card z-20 rounded-b-2xl" />

              <img
                src={homeImg}
                alt="Revision Master App"
                className="w-full h-full object-cover object-top"
              />

              {/* Screen gleam */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 rounded-[2.2rem] ring-1 ring-primary/20 pointer-events-none" />
            </motion.div>

            {/* Floating accent orbs */}
            {[
              {
                top: "12%",
                left: "-16%",
                color: "#8B5CF6",
                delay: 0,
                dur: 3.2,
              },
              {
                top: "70%",
                right: "-12%",
                color: "#22D3EE",
                delay: 1,
                dur: 3.8,
              },
              {
                top: "88%",
                left: "12%",
                color: "#F472B6",
                delay: 1.8,
                dur: 2.8,
              },
              { top: "6%", right: "6%", color: "#FDBA74", delay: 0.5, dur: 4 },
            ].map((o, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  top: o.top,
                  left: "left" in o ? o.left : undefined,
                  right: "right" in o ? o.right : undefined,
                  backgroundColor: o.color,
                  boxShadow: `0 0 14px ${o.color}, 0 0 28px ${o.color}60`,
                }}
                animate={{
                  y: [-7, 7, -7],
                  opacity: [0.55, 1, 0.55],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  repeat: Infinity,
                  duration: o.dur,
                  ease: "easeInOut",
                  delay: o.delay,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-foreground/30"
        >
          <span className="text-[10px] font-display tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
