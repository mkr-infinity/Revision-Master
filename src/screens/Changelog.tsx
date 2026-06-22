import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Palette,
  BookOpen,
  FileText,
  LineChart,
  Repeat,
  Brain,
  Layers,
  Image,
  Settings as SettingsIcon,
  Wand2,
  FlaskConical,
  ClipboardList,
  Paintbrush,
  SunMoon,
  UserCircle2,
  Globe,
  Smartphone,
  Star,
  Zap,
  Rocket,
  Bug,
  TrendingUp,
} from "lucide-react";

interface ChangeEntry {
  icon: React.ElementType;
  color: string;
  bg: string;
  title: string;
  desc: string;
  tag?: string;
}

interface VersionData {
  version: string;
  label: string;
  tagline: string;
  date: string;
  accent: string;
  dotColor: string;
  entries: ChangeEntry[];
  isCurrent?: boolean;
}

const VERSIONS: VersionData[] = [
  {
    version: "2.0.2",
    label: "v2.0.2",
    tagline: "Custom AI & Model Discovery",
    date: "June 2026",
    accent: "from-violet-500 via-indigo-500 to-blue-500",
    dotColor: "#6366f1",
    isCurrent: true,
    entries: [
      {
        icon: Globe,
        color: "text-indigo-400",
        bg: "bg-indigo-500/12",
        title: "Custom AI Provider",
        desc: "Connect any OpenAI-compatible API — Together AI, Groq, Fireworks, Mistral, OpenRouter, DeepSeek, local Ollama, and more. Set your base URL, paste an optional key, fetch models and pick one.",
        tag: "New",
      },
      {
        icon: Sparkles,
        color: "text-violet-400",
        bg: "bg-violet-500/12",
        title: "Automatic Model Discovery",
        desc: "Fetch Models probes /v1/models, /api/tags, and /api/models in order — covering cloud APIs and self-hosted servers automatically with a single tap.",
        tag: "New",
      },
      {
        icon: Wand2,
        color: "text-emerald-400",
        bg: "bg-emerald-500/12",
        title: "Searchable Model Picker",
        desc: "Models are now displayed in a scrollable, searchable list with organisation name, model name, and a live count filter so large model lists stay easy to navigate.",
        tag: "New",
      },
      {
        icon: SettingsIcon,
        color: "text-rose-400",
        bg: "bg-rose-500/12",
        title: "Provider Save & Subtitle Fix",
        desc: "Custom provider selection now saves correctly. The AI subtitle in Settings reflects the active provider immediately after saving — no more 'Gemini · No key set' after switching.",
        tag: "Fix",
      },
      {
        icon: Bug,
        color: "text-amber-400",
        bg: "bg-amber-500/12",
        title: "Font Rendering Fix",
        desc: "Decorative and Japanese fonts (Zen Maru Gothic, Mochiy Pop One, Bagel Fat One) now load reliably via Google Fonts CDN — resolving the issue where all text appeared bold due to failed font file decoding.",
        tag: "Fix",
      },
    ],
  },
  {
    version: "2.0.1",
    label: "v2.0.1",
    tagline: "Bug Fix Patch",
    date: "May 2026",
    accent: "from-amber-500 via-orange-500 to-red-500",
    dotColor: "#f59e0b",
    entries: [
      {
        icon: BookOpen,
        color: "text-sky-400",
        bg: "bg-sky-500/12",
        title: "Fixed Flashcard Buttons",
        desc: "Flashcard study action buttons were unresponsive in certain screen sizes and themes — now fixed across all configurations.",
        tag: "Fix",
      },
      {
        icon: FileText,
        color: "text-purple-400",
        bg: "bg-purple-500/12",
        title: "Fixed PDF Export",
        desc: "Resolved an issue where PDF export would fail silently or produce incomplete output for certain deck types.",
        tag: "Fix",
      },
      {
        icon: SettingsIcon,
        color: "text-rose-400",
        bg: "bg-rose-500/12",
        title: "Fixed Custom API Key",
        desc: "Custom Gemini API key settings were not persisting correctly between sessions — now saved and applied reliably without requiring a restart.",
        tag: "Fix",
      },
      {
        icon: Zap,
        color: "text-amber-400",
        bg: "bg-amber-500/12",
        title: "Stability Improvements",
        desc: "Various under-the-hood bug fixes, minor UI polish, and reliability improvements across the app.",
        tag: "Improved",
      },
    ],
  },
  {
    version: "2.0",
    label: "v2.0",
    tagline: "The Polished Arc",
    date: "April 2026",
    accent: "from-fuchsia-500 via-pink-500 to-rose-500",
    dotColor: "#ec4899",
    entries: [
      {
        icon: Palette,
        color: "text-violet-400",
        bg: "bg-violet-500/12",
        title: "7 Anime Themes",
        desc: "Demon Slayer, My Hero Academia, Naruto, Jujutsu Kaisen, Bleach, Vinland Saga & Solo Leveling palettes — each with matching light and dark variants.",
        tag: "New",
      },
      {
        icon: SunMoon,
        color: "text-amber-400",
        bg: "bg-amber-500/12",
        title: "Wallpaper Control",
        desc: "Custom background upload, a focus mode toggle that removes wallpaper entirely, and theme wallpapers that load from stable local assets.",
        tag: "New",
      },
      {
        icon: Image,
        color: "text-sky-400",
        bg: "bg-sky-500/12",
        title: "Full-Screen Image Viewer",
        desc: "Card images open in a proper safe-area full-screen viewer for easier reading on mobile devices.",
        tag: "New",
      },
      {
        icon: Paintbrush,
        color: "text-fuchsia-400",
        bg: "bg-fuchsia-500/12",
        title: "Theme-Aware UI",
        desc: "Every major surface — cards, modals, sheets, action bars — now follows the active theme with correct elevation, borders, and contrast ratios.",
        tag: "Improved",
      },
      {
        icon: Layers,
        color: "text-blue-400",
        bg: "bg-blue-500/12",
        title: "Deck System Polish",
        desc: "Deck browsing, card organisation, and study flow were tightened up. Grid and list layouts, size controls, and swipe gestures all feel smoother.",
        tag: "Improved",
      },
      {
        icon: Repeat,
        color: "text-amber-400",
        bg: "bg-amber-500/12",
        title: "Revision Tracking",
        desc: "Clearer mastery and review states make study progress easier to follow at a glance.",
        tag: "Improved",
      },
      {
        icon: FlaskConical,
        color: "text-teal-400",
        bg: "bg-teal-500/12",
        title: "Formula Library Polish",
        desc: "Study modal cards, flip button, and action bar now match the active theme on both mobile and desktop.",
        tag: "Improved",
      },
      {
        icon: ClipboardList,
        color: "text-indigo-400",
        bg: "bg-indigo-500/12",
        title: "Mock Tests",
        desc: "Test screens polished with better spacing, a clearer timer setup flow, and smoother layout transitions.",
        tag: "Improved",
      },
      {
        icon: SettingsIcon,
        color: "text-rose-400",
        bg: "bg-rose-500/12",
        title: "Settings Improvements",
        desc: "Settings now includes background controls, theme-aware cards, clearer section hierarchy, and a proper version info page.",
        tag: "Improved",
      },
      {
        icon: Star,
        color: "text-yellow-400",
        bg: "bg-yellow-500/12",
        title: "Deep Polish Pass",
        desc: "Buttons, spacing, shadows, and surface hierarchy were refined throughout — every screen got attention.",
        tag: "Improved",
      },
      {
        icon: UserCircle2,
        color: "text-pink-400",
        bg: "bg-pink-500/12",
        title: "Edit Profile Button",
        desc: "Profile editing now uses a clear gradient pill button instead of a hidden pencil icon — much easier to find.",
        tag: "UX",
      },
      {
        icon: BookOpen,
        color: "text-sky-400",
        bg: "bg-sky-500/12",
        title: "Flashcard Layout Fix",
        desc: "Study cards scroll cleanly, keep consistent spacing, and are easier to read on real devices.",
        tag: "Fix",
      },
      {
        icon: SettingsIcon,
        color: "text-rose-300",
        bg: "bg-rose-500/10",
        title: "Disable Background Fix",
        desc: "The disable background option now cleanly removes both custom and default wallpaper layers without side effects.",
        tag: "Fix",
      },
    ],
  },
  {
    version: "1.0",
    label: "v1.0",
    tagline: "The Origin",
    date: "February 2026",
    accent: "from-blue-500 via-indigo-500 to-purple-500",
    dotColor: "#6366f1",
    entries: [
      {
        icon: Layers,
        color: "text-blue-400",
        bg: "bg-blue-500/12",
        title: "Flashcard Decks",
        desc: "Create unlimited decks and cards with custom themes, difficulty tags, and favourites.",
      },
      {
        icon: BookOpen,
        color: "text-sky-400",
        bg: "bg-sky-500/12",
        title: "Card Study Flow",
        desc: "Flip study mode, focus states, and clean layouts designed for repeated revision sessions.",
      },
      {
        icon: Brain,
        color: "text-indigo-400",
        bg: "bg-indigo-500/12",
        title: "AI Card Generation",
        desc: "Generate flashcards and formula sheets instantly from a topic, PDF, or YouTube URL.",
      },
      {
        icon: FileText,
        color: "text-purple-400",
        bg: "bg-purple-500/12",
        title: "Mock Tests",
        desc: "AI-generated multiple-choice tests with timer modes and per-question explanations.",
      },
      {
        icon: FlaskConical,
        color: "text-teal-400",
        bg: "bg-teal-500/12",
        title: "Formula Library",
        desc: "Dedicated deck type for equations with a flip-card study mode and LaTeX-friendly display.",
      },
      {
        icon: LineChart,
        color: "text-emerald-400",
        bg: "bg-emerald-500/12",
        title: "Analytics & Streaks",
        desc: "Daily activity heatmap, XP system, accuracy stats, and streak tracking to keep you motivated.",
      },
      {
        icon: FileText,
        color: "text-rose-400",
        bg: "bg-rose-500/12",
        title: "PDF Export",
        desc: "Export any flashcard deck as a printable PDF in one tap — great for offline study.",
      },
      {
        icon: Repeat,
        color: "text-amber-400",
        bg: "bg-amber-500/12",
        title: "Spaced Revision",
        desc: "Mark cards as mastered or needing review — the app remembers your progress across sessions.",
      },
      {
        icon: Palette,
        color: "text-pink-400",
        bg: "bg-pink-500/12",
        title: "Themes & Customisation",
        desc: "Light and dark mode, custom avatar, exam target, and countdown date personalisation.",
      },
      {
        icon: Sparkles,
        color: "text-cyan-400",
        bg: "bg-cyan-500/12",
        title: "MKR AI Assistant",
        desc: "Built-in AI assistant powered by Gemini to answer study questions on demand.",
      },
      {
        icon: Smartphone,
        color: "text-violet-400",
        bg: "bg-violet-500/12",
        title: "Android APK",
        desc: "Packaged with Capacitor 8 for native Android installation — study anywhere, offline.",
      },
    ],
  },
];

const TAG_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  New:      { bg: "bg-emerald-500/12", text: "text-emerald-400", border: "border-emerald-500/25" },
  Improved: { bg: "bg-blue-500/12",    text: "text-blue-400",    border: "border-blue-500/25"    },
  Fix:      { bg: "bg-amber-500/12",   text: "text-amber-400",   border: "border-amber-500/25"   },
  UX:       { bg: "bg-violet-500/12",  text: "text-violet-400",  border: "border-violet-500/25"  },
};

function countTags(entries: ChangeEntry[]) {
  const counts: Record<string, number> = {};
  for (const e of entries) {
    if (e.tag) counts[e.tag] = (counts[e.tag] || 0) + 1;
  }
  return counts;
}

const TagPill: React.FC<{ tag: string; count?: number }> = ({ tag, count }) => {
  const s = TAG_STYLES[tag];
  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      {count !== undefined && <span className="opacity-70 text-[9px]">{count}×</span>}
      {tag}
    </span>
  );
};

const VersionCard: React.FC<{
  data: VersionData;
  defaultOpen: boolean;
  vRef?: React.RefObject<HTMLDivElement>;
}> = ({ data, defaultOpen, vRef }) => {
  const [open, setOpen] = useState(defaultOpen);
  const counts = countTags(data.entries);

  return (
    <div ref={vRef} className="relative">
      <motion.button
        whileTap={{ scale: 0.985 }}
        onClick={() => setOpen((v) => !v)}
        className="w-full relative overflow-hidden rounded-3xl border text-left transition-shadow focus:outline-none"
        style={{
          background: data.isCurrent
            ? "color-mix(in srgb, var(--color-primary) 7%, var(--bg-elevated))"
            : "var(--bg-elevated)",
          borderColor: data.isCurrent
            ? "color-mix(in srgb, var(--color-primary) 30%, var(--border-subtle))"
            : "var(--border-subtle)",
          boxShadow: data.isCurrent
            ? "0 4px 24px -8px color-mix(in srgb, var(--color-primary) 22%, transparent)"
            : "none",
        }}
      >
        {data.isCurrent && (
          <div
            className="absolute inset-x-0 top-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, ${data.dotColor}, transparent)`,
              opacity: 0.8,
            }}
          />
        )}

        <div className="flex items-center gap-3.5 px-4 py-3.5">
          <div
            className={`size-12 rounded-2xl bg-gradient-to-br ${data.accent} flex items-center justify-center shrink-0`}
            style={{ boxShadow: `0 6px 20px -4px ${data.dotColor}55` }}
          >
            <span className="text-white font-black text-[11px] tracking-tight leading-none">
              {data.label}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-[15px] text-primary-fg leading-tight">{data.tagline}</p>
                  {data.isCurrent && (
                    <span
                      className="shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{
                        background: "color-mix(in srgb, var(--color-primary) 16%, transparent)",
                        color: "var(--color-primary)",
                        border: "1px solid color-mix(in srgb, var(--color-primary) 32%, transparent)",
                      }}
                    >
                      Current
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-tertiary-fg mt-0.5 font-semibold">{data.date}</p>
              </div>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="shrink-0 mt-1"
              >
                <ChevronDown size={16} className="text-tertiary-fg" />
              </motion.div>
            </div>

            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {Object.entries(counts).map(([tag, count]) => (
                <TagPill key={tag} tag={tag} count={count} />
              ))}
            </div>
          </div>
        </div>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-1.5 pb-1">
              {data.entries.map((entry, i) => {
                const Icon = entry.icon;
                const tagStyle = entry.tag ? TAG_STYLES[entry.tag] : null;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.18 }}
                    className="flex items-start gap-3 px-3.5 py-3 rounded-2xl border transition-colors"
                    style={{
                      background: "var(--bg-surface-2)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${entry.bg}`}>
                      <Icon size={15} className={entry.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <p className="text-[13px] font-bold text-primary-fg leading-snug">{entry.title}</p>
                        {entry.tag && tagStyle && (
                          <span className={`text-[8px] font-black uppercase tracking-[0.12em] px-1.5 py-[2px] rounded-full border ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border}`}>
                            {entry.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-secondary-fg leading-relaxed">{entry.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Changelog: React.FC = () => {
  const navigate = useNavigate();
  const currentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const current = VERSIONS.find((v) => v.isCurrent)!;
  const currentCounts = countTags(current.entries);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentRef.current && scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="font-display text-primary-fg flex flex-col h-full"
    >
      <header
        className="sticky top-0 z-50 px-4 pb-2.5 shrink-0"
        style={{ paddingTop: `calc(env(safe-area-inset-top) + 6px)` }}
      >
        <div className="flex items-center gap-3 backdrop-blur-xl bg-elevated/60 border border-white/[0.08] shadow-md shadow-black/10 rounded-[1.35rem] px-3.5 py-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="size-10 rounded-2xl bg-white/35 dark:bg-white/8 border border-white/[0.10] shadow-sm flex items-center justify-center hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft size={22} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h1 className="font-black text-lg leading-tight text-primary-fg">Changelog</h1>
                <p className="text-[11px] text-tertiary-fg font-semibold">Revision Master · Release notes</p>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black shrink-0"
                style={{
                  background: "color-mix(in srgb, var(--color-primary) 14%, transparent)",
                  color: "var(--color-primary)",
                  border: "1px solid color-mix(in srgb, var(--color-primary) 28%, transparent)",
                }}
              >
                <Star size={10} className="fill-current" />
                v2.0.2 Latest
              </div>
            </div>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-24" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="p-4 max-w-lg mx-auto space-y-5">

          {/* ── Hero card for current release ── */}
          <div
            className="relative overflow-hidden rounded-3xl p-5"
            style={{
              background: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)`,
              boxShadow: "0 12px 40px -10px #6366f166",
            }}
          >
            {/* decorative blobs */}
            <div className="absolute -top-8 -right-8 size-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
            <div className="absolute -bottom-10 -left-6 size-32 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)" }} />

            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Rocket size={14} className="text-white/80" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Latest Release</span>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight leading-none">v2.0.2</h2>
                  <p className="text-white/75 text-sm font-semibold mt-1">Custom AI Provider · Model Discovery</p>
                </div>
                <div className="shrink-0 size-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles size={24} className="text-white" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {Object.entries(currentCounts).map(([tag, count]) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white/90 backdrop-blur-sm"
                    style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}
                  >
                    {tag === "New" && <TrendingUp size={10} />}
                    {tag === "Fix" && <Bug size={10} />}
                    {tag === "Improved" && <Zap size={10} />}
                    {count} {tag}
                  </div>
                ))}
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white/70"
                  style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  {current.date}
                </div>
              </div>
            </div>
          </div>

          {/* ── Version list ── */}
          <div className="relative">
            {/* timeline spine */}
            <div
              className="absolute left-[1.6rem] top-6 bottom-6 w-px"
              style={{ background: "linear-gradient(to bottom, var(--color-primary), var(--border-subtle) 60%)" }}
            />

            <div className="space-y-3 relative">
              {VERSIONS.map((v) => (
                <VersionCard
                  key={v.version}
                  data={v}
                  defaultOpen={v.isCurrent ?? false}
                  vRef={v.isCurrent ? currentRef : undefined}
                />
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="pt-4 pb-2 text-center space-y-2">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]"
              style={{
                background: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                color: "color-mix(in srgb, var(--color-primary) 70%, var(--text-tertiary))",
                border: "1px solid color-mix(in srgb, var(--color-primary) 16%, transparent)",
              }}
            >
              <Star size={9} className="fill-current opacity-60" />
              End of changelog
            </div>
            <p className="text-[10px] text-tertiary-fg/50 font-semibold">More updates on the way</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Changelog;
