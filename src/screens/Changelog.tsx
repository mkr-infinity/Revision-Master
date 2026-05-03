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
} from "lucide-react";

interface ChangeEntry {
  icon: React.ElementType;
  color: string;
  title: string;
  desc: string;
  tag?: string;
}

interface VersionData {
  version: string;
  label: string;
  tagline: string;
  accent: string;
  entries: ChangeEntry[];
  isCurrent?: boolean;
}

const VERSIONS: VersionData[] = [
  {
    version: "2.0",
    label: "v2.0",
    tagline: "The Polished Arc",
    accent: "from-violet-500 via-fuchsia-500 to-pink-500",
    isCurrent: true,
    entries: [
      {
        icon: Palette,
        color: "text-violet-400",
        title: "7 Anime Themes",
        desc: "Demon Slayer, My Hero Academia, Naruto, Jujutsu Kaisen, Bleach, Vinland Saga & Solo Leveling palettes.",
        tag: "New",
      },
      {
        icon: BookOpen,
        color: "text-sky-400",
        title: "Flashcard Study Cards",
        desc: "Cards now scroll cleanly, keep better spacing, and feel easier to read on real devices.",
        tag: "Fix",
      },
      {
        icon: Layers,
        color: "text-blue-400",
        title: "Deck System Polish",
        desc: "Deck browsing, card organization, and study flow were tightened up across the app.",
        tag: "Improved",
      },
      {
        icon: Paintbrush,
        color: "text-fuchsia-400",
        title: "Theme-Aware UI",
        desc: "Major UI surfaces now follow the active theme with proper elevation, borders, and contrast.",
        tag: "Improved",
      },
      {
        icon: Repeat,
        color: "text-amber-400",
        title: "Revision Tracking",
        desc: "Added clearer mastery and review states so study progress is easier to follow.",
        tag: "Improved",
      },
      {
        icon: Star,
        color: "text-yellow-400",
        title: "Deep Polish Pass",
        desc: "Buttons, spacing, shadows, and surface hierarchy were refined throughout the UI.",
        tag: "Improved",
      },
      {
        icon: SunMoon,
        color: "text-amber-400",
        title: "Wallpaper Control",
        desc: "Added custom background upload and a focus mode toggle that removes the wallpaper completely.",
        tag: "New",
      },
      {
        icon: Globe,
        color: "text-cyan-400",
        title: "Stable Local Assets",
        desc: "Theme wallpapers now load from the app asset folder so they behave consistently like custom images.",
        tag: "Improved",
      },
      {
        icon: Image,
        color: "text-sky-400",
        title: "Full-Screen Image Viewer",
        desc: "Card images open in a proper safe-area viewer for easier reading on mobile.",
        tag: "New",
      },
      {
        icon: UserCircle2,
        color: "text-pink-400",
        title: "Edit Profile Button",
        desc: "Profile editing now uses a clear gradient pill button instead of a hidden pencil icon.",
        tag: "UX",
      },
      {
        icon: FlaskConical,
        color: "text-teal-400",
        title: "Formula Library Polish",
        desc: "Study modal cards, flip button and action bar now match the active theme on mobile and desktop.",
        tag: "Improved",
      },
      {
        icon: ClipboardList,
        color: "text-indigo-400",
        title: "Mock Tests",
        desc: "Test screens were polished with better spacing, clearer timer setup, and smoother layout flow.",
        tag: "Improved",
      },
      {
        icon: SettingsIcon,
        color: "text-rose-400",
        title: "Settings Improvements",
        desc: "Settings now includes background controls, theme-aware cards, and clearer actions.",
        tag: "Improved",
      },
      {
        icon: Image,
        color: "text-sky-300",
        title: "Disable Background Fix",
        desc: "The disable background option now cleanly removes both custom and default wallpaper layers.",
        tag: "Fix",
      },
      {
        icon: Globe,
        color: "text-cyan-400",
        title: "Website Showcase",
        desc: "Full anime-styled landing page with screenshots, dark/light toggle and deploy configs for GitHub Pages, Vercel & Netlify.",
        tag: "New",
      },
      {
        icon: Globe,
        color: "text-cyan-300",
        title: "Wallpaper Asset Folder",
        desc: "Theme wallpapers now live in a stable asset folder so they load reliably like custom uploads.",
        tag: "Improved",
      },
      {
        icon: Image,
        color: "text-sky-300",
        title: "Fixed Wallpaper Behaviour",
        desc: "Default wallpaper now stays fixed and no longer scrolls or shifts with page content.",
        tag: "Fix",
      },
      {
        icon: SettingsIcon,
        color: "text-rose-300",
        title: "Disable Background Fix",
        desc: "The disable background control now cleanly disables every wallpaper layer without side effects.",
        tag: "Fix",
      },
      {
        icon: Sparkles,
        color: "text-cyan-300",
        title: "AI Chatbot",
        desc: "The built-in chatbot was removed from this release to keep the focus on study tools and UI polish.",
        tag: "Fix",
      },
    ],
  },
  {
    version: "1.0",
    label: "v1.0",
    tagline: "The Origin",
    accent: "from-blue-500 via-indigo-500 to-purple-500",
    entries: [
      {
        icon: Layers,
        color: "text-blue-400",
        title: "Flashcard Decks",
        desc: "Create unlimited decks and cards with custom themes, difficulty tags and favourites.",
      },
      {
        icon: BookOpen,
        color: "text-sky-400",
        title: "Card Study Flow",
        desc: "Cards were designed for repeated revision with flip study mode, focus states, and cleaner layouts.",
      },
      {
        icon: Brain,
        color: "text-indigo-400",
        title: "AI Card Generation",
        desc: "Generate flashcards and formula sheets instantly from a topic, PDF or YouTube URL.",
      },
      {
        icon: FileText,
        color: "text-purple-400",
        title: "Mock Tests",
        desc: "AI-generated multiple-choice tests with timer modes and per-question explanations.",
      },
      {
        icon: FlaskConical,
        color: "text-teal-400",
        title: "Formula Library",
        desc: "Dedicated deck type for equations with flip-card study mode.",
      },
      {
        icon: LineChart,
        color: "text-emerald-400",
        title: "Analytics & Streaks",
        desc: "Daily activity heatmap, XP system, accuracy stats and streak tracking.",
      },
      {
        icon: FileText,
        color: "text-rose-400",
        title: "PDF Export",
        desc: "Export any flashcard deck as a printable PDF in one tap.",
      },
      {
        icon: Repeat,
        color: "text-amber-400",
        title: "Spaced Revision",
        desc: "Mark cards as mastered or needing review — the app remembers your progress.",
      },
      {
        icon: Palette,
        color: "text-pink-400",
        title: "Themes & Customisation",
        desc: "Light and dark mode, custom avatar, exam target and countdown date.",
      },
      {
        icon: Repeat,
        color: "text-amber-400",
        title: "Card Revision Flow",
        desc: "Cards were built around repeated revision, with tracking for mastered and review states.",
      },
      {
        icon: Paintbrush,
        color: "text-fuchsia-400",
        title: "Card Design Updates",
        desc: "Cards were improved with better spacing, stronger contrast, and theme-aware surfaces.",
      },
      {
        icon: ClipboardList,
        color: "text-rose-400",
        title: "Study Screens",
        desc: "Flashcard, test, and formula screens were refined to feel cleaner on phones and tablets.",
      },
      {
        icon: Sparkles,
        color: "text-cyan-400",
        title: "MKR AI Chatbot",
        desc: "Built-in AI assistant to answer study questions on demand.",
      },
      {
        icon: Globe,
        color: "text-cyan-300",
        title: "Website Showcase",
        desc: "A dedicated website folder was added for the anime-style landing page and deploy targets.",
      },
      {
        icon: Smartphone,
        color: "text-violet-400",
        title: "Android APK",
        desc: "Packaged with Capacitor 8 for native Android installation.",
      },
    ],
  },
];

const TAG_COLORS: Record<string, string> = {
  New: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  Improved: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  Fix: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  UX: "bg-violet-500/15 text-violet-400 border border-violet-500/25",
};

const VersionCard: React.FC<{
  data: VersionData;
  defaultOpen: boolean;
  vRef?: React.RefObject<HTMLDivElement>;
}> = ({ data, defaultOpen, vRef }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div ref={vRef} className="relative">
      <motion.button
        whileTap={{ scale: 0.985 }}
        onClick={() => setOpen((v) => !v)}
        className="w-full relative overflow-hidden rounded-3xl border text-left transition-all focus:outline-none"
        style={{
          background: data.isCurrent
            ? "color-mix(in srgb, var(--color-primary) 8%, var(--bg-elevated))"
            : "var(--bg-elevated)",
          borderColor: data.isCurrent
            ? "color-mix(in srgb, var(--color-primary) 28%, var(--border-subtle))"
            : "var(--border-subtle)",
        }}
      >
        {data.isCurrent && (
          <div
            className="absolute inset-x-0 top-0 h-0.5 rounded-full"
            style={{
              background: `linear-gradient(90deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 40%, transparent))`,
            }}
          />
        )}
        <div className="flex items-center gap-4 px-5 py-4">
          <div
            className={`size-12 rounded-2xl bg-gradient-to-br ${data.accent} flex items-center justify-center shrink-0 shadow-lg`}
          >
            <span className="text-white font-black text-sm tracking-tight leading-none">
              {data.label}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-black text-base text-primary-fg leading-tight">
                {data.tagline}
              </p>
              {data.isCurrent && (
                <span className="shrink-0 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "color-mix(in srgb, var(--color-primary) 18%, transparent)",
                    color: "var(--color-primary)",
                    border: "1px solid color-mix(in srgb, var(--color-primary) 35%, transparent)",
                  }}
                >
                  Current
                </span>
              )}
            </div>
                  <p className="text-[11px] text-tertiary-fg mt-0.5 font-semibold">
              {data.entries.length} changes
            </p>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="shrink-0"
          >
            <ChevronDown size={18} className="text-secondary-fg" />
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-1.5 pb-1">
              {data.entries.map((entry, i) => {
                const Icon = entry.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.035, duration: 0.2 }}
                    className="flex items-start gap-3.5 px-4 py-3 rounded-2xl border transition-colors"
                    style={{
                      background: "var(--bg-surface-2)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <div
                      className="size-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background:
                          "color-mix(in srgb, var(--color-primary) 10%, var(--bg-elevated))",
                      }}
                    >
                      <Icon size={15} className={entry.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-primary-fg leading-snug">
                          {entry.title}
                        </p>
                        {entry.tag && (
                          <span
                            className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full shrink-0 ${
                              TAG_COLORS[entry.tag] ?? ""
                            }`}
                          >
                            {entry.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-secondary-fg mt-0.5 leading-relaxed">
                        {entry.desc}
                      </p>
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
  const v2Ref = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (v2Ref.current && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const el = v2Ref.current;
        const elTop = el.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top;
        const offset = elTop - (container.clientHeight / 2 - el.clientHeight / 2);
        container.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
      }
    }, 120);
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
                v2.0 Latest
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pb-24"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="p-4 max-w-lg mx-auto space-y-4">
          <div className="pt-2 pb-1 px-1 flex items-center gap-3">
            <div
              className="size-8 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 60%, #000))",
              }}
            >
              <Zap size={15} className="text-white" />
            </div>
            <div>
              <p className="font-black text-sm text-primary-fg">Patch Notes</p>
              <p className="text-[10px] text-tertiary-fg font-semibold uppercase tracking-widest">
                Expand a version to see what changed
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute left-[1.625rem] top-0 bottom-0 w-px"
              style={{ background: "var(--border-subtle)" }}
            />

            <div className="space-y-3 relative">
              {VERSIONS.map((v) => (
                <VersionCard
                  key={v.version}
                  data={v}
                  defaultOpen={false}
                  vRef={v.isCurrent ? v2Ref : undefined}
                />
              ))}
            </div>
          </div>

          <div className="pt-6 pb-2 text-center space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-tertiary-fg/50">
              End of changelog
            </p>
            <p className="text-[9px] text-tertiary-fg/40 font-semibold">
              More updates coming soon
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Changelog;
