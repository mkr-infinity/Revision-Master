import { motion } from "framer-motion";
import { Download, Github, ChevronDown } from "lucide-react";
import homeImg from "@assets/home_1777901812087.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Readability gradient over the background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/55 to-transparent dark:from-[#030408]/92 dark:via-[#030408]/55 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 md:px-10 pt-28 pb-24 relative z-10 w-full">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-16 xl:gap-24 items-center max-w-6xl mx-auto">

          {/* ── LEFT ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-7"
          >
            {/* Release badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="w-fit"
            >
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/8 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="text-[11px] font-bold font-display tracking-[0.18em] uppercase text-primary/90">
                  Version 2.0.2 — Anime Edition
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <div className="flex flex-col gap-1" style={{ lineHeight: 0.88 }}>
              {["Study", "Smarter.", "Score Higher."].map((word, i) => (
                <motion.h1
                  key={word}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display font-black tracking-[-0.025em] text-foreground"
                  style={{
                    fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
                    ...(word === "Smarter." ? {
                      background: "linear-gradient(125deg, #8B5CF6 0%, #22D3EE 60%, #C084FC 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    } : {}),
                    ...(word === "Score Higher." ? {
                      background: "linear-gradient(125deg, #F97316 0%, #EC4899 55%, #8B5CF6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    } : {}),
                  }}
                >
                  {word}
                </motion.h1>
              ))}
            </div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-2.5 origin-left"
            >
              <div className="h-[2px] w-12 rounded-full bg-primary/70" />
              <div className="h-[2px] w-6 rounded-full bg-primary/30" />
              <div className="h-[2px] w-3 rounded-full bg-primary/15" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.62, duration: 0.6 }}
              className="text-[1rem] md:text-[1.1rem] text-foreground/60 dark:text-foreground/50 max-w-[460px] leading-[1.75] font-normal"
            >
              Your ultimate anime study companion. AI flashcards, mock tests, formula libraries, and a gamification system that makes learning genuinely addictive.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.5 }}
              className="flex flex-wrap gap-3 pt-1"
            >
              <a href="https://github.com/mkr-infinity/Revision-Master/releases/latest/" target="_blank" rel="noreferrer">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold font-display text-[13px] tracking-[0.12em] uppercase text-white"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #8B5CF6 50%, #22D3EE)",
                    boxShadow: "0 0 0 1px rgba(139,92,246,0.3), 0 8px 32px rgba(139,92,246,0.35)",
                  }}
                >
                  <Download size={14} strokeWidth={2.5} />
                  Download APK
                </motion.button>
              </a>

              <a href="https://github.com/mkr-infinity/Revision-Master" target="_blank" rel="noreferrer">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold font-display text-[13px] tracking-[0.12em] uppercase text-foreground/80 border border-foreground/12 hover:border-foreground/25 bg-foreground/4 hover:bg-foreground/8 transition-colors duration-200"
                >
                  <Github size={14} strokeWidth={2} />
                  View Source
                </motion.button>
              </a>
            </motion.div>

            {/* Social proof row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.88, duration: 0.5 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1"
            >
              {[
                { value: "100%", label: "Free forever" },
                { value: "6", label: "Anime themes" },
                { value: "Offline", label: "No account needed" },
              ].map((stat, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="text-base font-black font-display text-foreground/90">{stat.value}</span>
                  <span className="text-xs text-foreground/40 font-medium">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT — Phone ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative mx-auto lg:mx-0 w-full max-w-[240px] md:max-w-[270px] lg:max-w-[100%]"
          >
            {/* Single ambient glow — intentional, not chaotic */}
            <div
              className="absolute inset-[-35%] rounded-full blur-[120px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(34,211,238,0.08) 55%, transparent 80%)" }}
            />

            {/* Phone */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              className="relative w-full aspect-[9/19] rounded-[2.2rem] overflow-hidden"
              style={{
                border: "1px solid rgba(139,92,246,0.22)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.05) inset, 0 32px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(139,92,246,0.2)",
                background: "hsl(var(--card))",
              }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-[hsl(var(--card))] z-20 rounded-b-2xl" />
              <img
                src={homeImg}
                alt="Revision Master"
                className="w-full h-full object-cover object-top"
              />
              {/* Glass sheen */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/20"
        >
          <span className="text-[9px] font-display tracking-[0.3em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
            <ChevronDown size={14} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
