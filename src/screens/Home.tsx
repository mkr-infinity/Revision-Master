import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flame,
  Layers,
  BookOpen,
  FunctionSquare,
  X,
  Edit2,
  Calendar,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Star,
  Target,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useAppContext, Card } from "../context/AppContext";

const DEFAULT_QUOTES = [
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "The future depends on what you do today.",
  "You don't have to be great to start, but you have to start to be great.",
  "Strive for progress, not perfection.",
  "The only way to do great work is to love what you do.",
  "Education is the most powerful weapon which you can use to change the world.",
];

const getISTGreeting = () => {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const nd = new Date(utc + 3600000 * 5.5);
  const hour = nd.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const getThemeSecondaryButtonGradient = (theme?: string) => {
  const map: Record<string, string> = {
    "light-cream": "linear-gradient(135deg, rgba(255,58,94,0.26) 0%, rgba(255,255,255,0.95) 100%)",
    "light-paper": "linear-gradient(135deg, rgba(31,109,255,0.26) 0%, rgba(255,214,10,0.18) 100%)",
    "light-sand": "linear-gradient(135deg, rgba(255,122,26,0.26) 0%, rgba(255,210,74,0.16) 100%)",
    "dark-plum": "linear-gradient(135deg, rgba(168,85,247,0.34) 0%, rgba(255,255,255,0.08) 100%)",
    "dark-graphite": "linear-gradient(135deg, rgba(64,128,255,0.34) 0%, rgba(255,255,255,0.08) 100%)",
    "dark-forest": "linear-gradient(135deg, rgba(95,227,199,0.34) 0%, rgba(255,255,255,0.08) 100%)",
    "dark-void": "linear-gradient(135deg, rgba(74,158,255,0.34) 0%, rgba(255,255,255,0.08) 100%)",
  };
  return map[theme || ""] || "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 30%, var(--bg-elevated)) 0%, color-mix(in srgb, var(--bg-elevated) 92%, transparent) 100%)";
};

const Home = () => {
  const navigate = useNavigate();
  const { state, updateStreak, updateUser, updateDeck, clearHistory } = useAppContext();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(state.user.name);
  const [editExamTarget, setEditExamTarget] = useState(state.user.examTarget);
  const [editAvatar, setEditAvatar] = useState(state.user.avatar);
  const [editExamDate, setEditExamDate] = useState(state.user.examDate || "");
  const [editCustomQuote, setEditCustomQuote] = useState(state.user.customQuote || "");

  const [studyCard, setStudyCard] = useState<
    (Card & { deckName: string; deckId: string; type: string }) | null
  >(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streakFlipped, setStreakFlipped] = useState(false);

  const flashcardDecks = state.decks.filter((d) => d.type === "flashcard");
  const formulaDecks = state.decks.filter((d) => d.type === "formula");
  const totalFlashcards = flashcardDecks.reduce((acc, d) => acc + d.cards.length, 0);
  const totalFormulas = formulaDecks.reduce((acc, d) => acc + d.cards.length, 0);

  const getDaysLeft = (targetDate: string) => {
    if (!targetDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysLeft(state.user.examDate || "");

  const allCards = state.decks.flatMap((d) =>
    d.cards.map((c) => ({ ...c, deckName: d.name, deckId: d.id, type: d.type })),
  );
  const recentCards = allCards.slice(-5).reverse();
  const favouriteCards = allCards.filter((c) => c.isFavourite);
  const pinnedCards = allCards.filter((c) => c.isPinned);

  const greeting = useMemo(() => getISTGreeting(), []);
  const randomQuote = useMemo(
    () => DEFAULT_QUOTES[Math.floor(Math.random() * DEFAULT_QUOTES.length)],
    [],
  );
  const displayQuote = state.user.customQuote || randomQuote;

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    updateUser({
      name: editName,
      examTarget: editExamTarget,
      avatar: editAvatar,
      examDate: editExamDate,
      customQuote: editCustomQuote,
    });
    setShowEditProfile(false);
  };

  const openEditProfile = () => {
    setEditName(state.user.name);
    setEditExamTarget(state.user.examTarget);
    setEditAvatar(state.user.avatar);
    setEditExamDate(state.user.examDate || "");
    setEditCustomQuote(state.user.customQuote || "");
    setShowEditProfile(true);
  };

  const streakProgress = state.streak.current % 7 || (state.streak.current > 0 ? 7 : 0);

  const customBgImage = state.user.customBgImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`font-display text-primary-fg pb-6 relative ${customBgImage ? "" : "home-screen-bg"}`}
    >
      {/* Header */}
      <header
        className="px-4 pb-3 sticky top-0 z-40"
        style={{ paddingTop: `calc(env(safe-area-inset-top) + 8px)` }}
      >
        <div className="flex items-center justify-between backdrop-blur-xl bg-elevated/60 border border-white/[0.08] shadow-md shadow-black/10 rounded-[1.35rem] px-3.5 py-2">
        <button
          onClick={openEditProfile}
          className="flex items-center gap-3 group active:scale-[0.98] transition-transform"
        >
          <div className="relative">
            <div className="size-10 rounded-2xl overflow-hidden bg-surface-2 ring-1 ring-[var(--color-primary)]/25 shadow-sm">
              <img
                src={state.user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {state.user.level > 1 && (
              <div className="absolute -bottom-1 -right-1 bg-[var(--color-primary)] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                Lv {state.user.level}
              </div>
            )}
          </div>
          <div className="text-left">
            <p className="text-[10px] text-secondary-fg font-medium leading-tight">
              {greeting}
            </p>
            <h1 className="font-bold text-[16px] leading-tight tracking-tight text-primary-fg">
              {state.user.name || "Scholar"}
              <span className="ml-1 text-[12px]">★</span>
            </h1>
          </div>
        </button>

        <button
          onClick={() => navigate("/stats")}
          className="size-10 rounded-2xl bg-white/35 dark:bg-white/8 border border-white/[0.10] shadow-sm flex items-center justify-center text-secondary-fg active:scale-95 transition-transform"
          aria-label="Stats"
        >
          <Sparkles size={17} />
        </button>
        </div>
      </header>

      <main className="px-5 pt-3 space-y-5 overflow-x-hidden">
        {/* Streak hero — premium flip card */}
        {(() => {
          const totalStudied = state.testStats.cardCorrect + state.testStats.cardWrong;
          const accuracy = totalStudied > 0
            ? Math.round((state.testStats.cardCorrect / totalStudied) * 100)
            : 0;
          const mockResults = state.testStats.mockResults;
          const lastMock = mockResults.length > 0 ? mockResults[mockResults.length - 1] : null;
          const lastMockPct = lastMock
            ? Math.round((lastMock.correct / lastMock.total) * 100)
            : null;
          const totalDecksCards = state.decks.reduce((a, d) => a + d.cards.length, 0);

          return (
            <section
              className="perspective-1000 cursor-pointer select-none w-full max-w-full overflow-hidden"
              style={{ height: 180 }}
              onClick={() => setStreakFlipped((f) => !f)}
              aria-label={streakFlipped ? "Flip back to streak" : "Flip to see analytics"}
            >
              <motion.div
                className="relative w-full h-full transform-style-preserve-3d rounded-3xl overflow-hidden"
                animate={{ rotateY: streakFlipped ? 180 : 0 }}
                transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* ── FRONT: Streak ── */}
                <div
                  className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden text-white shadow-glow"
                  style={{
                    background: "linear-gradient(135deg, color-mix(in srgb,var(--color-primary) 68%,#0a0a20) 0%, color-mix(in srgb,var(--color-primary) 52%,#080818) 55%, color-mix(in srgb,var(--color-primary) 40%,#04040f) 100%)",
                  }}
                >
                  {/* Decorative glows */}
                  <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-black/20 blur-2xl pointer-events-none" />
                  {/* Dot texture */}
                  <div
                    className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
                  />

                  <div className="relative z-10 h-full flex flex-col justify-between p-5">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                          <Flame size={24} className="text-white fill-white/80" />
                        </div>
                        <div>
                          <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.15em] leading-none mb-1">
                            Daily Streak
                          </p>
                          <p className="text-[32px] font-black leading-none tracking-tight">
                            {state.streak.current}
                            <span className="text-[14px] font-semibold text-white/70 ml-1.5">days</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5">
                          <Star size={12} className="text-amber-300 fill-amber-300" />
                          <span className="text-white font-black text-[13px] leading-none">{state.user.xp} XP</span>
                        </div>
                        <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest">
                          Level {state.user.level}
                        </p>
                      </div>
                    </div>

                    {/* Weekly progress */}
                    <div>
                      <div className="flex gap-1.5 mb-2">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i < streakProgress
                                ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                                : "bg-white/18"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-white/55 font-medium">
                          Best: <span className="text-white/80 font-bold">{state.streak.max}d</span>
                        </p>
                        <div className="flex items-center gap-1 text-white/40">
                          <RefreshCw size={9} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Analytics</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── BACK: Analytics ── */}
                <div
                  className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden text-white"
                  style={{
                    background: "linear-gradient(145deg, color-mix(in srgb,var(--color-primary) 75%,#000) 0%, color-mix(in srgb,var(--color-primary) 45%,#0d0015) 100%)",
                  }}
                >
                  <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-8 -right-4 w-36 h-36 rounded-full bg-black/30 blur-2xl pointer-events-none" />
                  <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
                  />

                  <div className="relative z-10 h-full flex flex-col justify-between p-4 pt-8 pb-3.5">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles size={13} className="text-white/70" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">Analytics</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearHistory();
                        }}
                        className="shrink-0 flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/85"
                      >
                        <RefreshCw size={9} />
                        Clear all
                      </button>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-white/35">
                      <div className="flex items-center gap-1 text-white/35">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStreakFlipped(false);
                          }}
                          className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white/70"
                        >
                          Back
                        </button>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        {
                          label: "Accuracy",
                          value: totalStudied > 0 ? `${accuracy}%` : "—",
                          color: accuracy >= 70 ? "#4ade80" : accuracy >= 40 ? "#fbbf24" : "#f87171",
                        },
                        {
                          label: "Studied",
                          value: totalStudied > 999 ? `${Math.round(totalStudied / 1000)}k` : String(totalStudied || "0"),
                          color: "rgba(255,255,255,0.9)",
                        },
                        {
                          label: "Best Str.",
                          value: `${state.streak.max}d`,
                          color: "#fb923c",
                        },
                        {
                          label: "Tests",
                          value: String(mockResults.length),
                          color: "#818cf8",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="flex flex-col items-center justify-center rounded-2xl py-2 border border-white/10"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                          <p className="text-[15px] font-black leading-none" style={{ color: stat.color }}>
                            {stat.value}
                          </p>
                          <p className="text-[8px] text-white/45 font-bold uppercase tracking-wider mt-1 leading-none">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/8 p-2.5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[8px] text-white/45 font-bold uppercase tracking-wider">Streak graph</p>
                        <p className="text-[9px] text-white/60 font-semibold">{state.streak.current} day run</p>
                      </div>
                      <div className="flex items-end gap-1.5 h-12">
                        {[22, 38, 30, 48, 34, 56, 42].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col justify-end">
                            <div
                              className="rounded-full"
                              style={{
                                height: `${Math.max(8, h)}%`,
                                background: i <= streakProgress
                                  ? "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 100%)"
                                  : "rgba(255,255,255,0.16)",
                                boxShadow: i <= streakProgress ? "0 0 10px rgba(255,255,255,0.28)" : "none",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Consistency", value: `${Math.min(100, Math.round((state.streak.current / Math.max(1, state.streak.max)) * 100))}%`, tone: "text-cyan-300" },
                        { label: "Best run", value: `${state.streak.max}d`, tone: "text-amber-300" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 p-2.5">
                          <p className={`text-[15px] font-black leading-none ${item.tone}`}>{item.value}</p>
                          <p className="text-[8px] text-white/45 font-bold uppercase tracking-wider mt-1">{item.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between">
                      {lastMockPct !== null ? (
                        <p className="text-[10px] text-white/50 font-medium">
                          Last test: <span className="text-white/80 font-bold">{lastMockPct}%</span>
                          {lastMock && <span className="text-white/35"> · {lastMock.total}q</span>}
                        </p>
                      ) : (
                        <p className="text-[10px] text-white/40 font-medium">
                          {totalDecksCards} cards in library
                        </p>
                      )}
                      <p className="text-[10px] text-white/35 font-medium">
                        Lv {state.user.level} scholar
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          );
        })()}

        {/* Goal card */}
        <section className="rounded-3xl border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] p-4 shadow-card">
          <div className="flex items-end justify-between mb-3">
            <span className="manga-headline">Current goal</span>
            <button
              onClick={openEditProfile}
              className="text-[12px] font-semibold text-[var(--color-primary)] flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Edit2 size={12} /> Edit
            </button>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)]"
            style={{
              boxShadow: "0 4px 24px -8px color-mix(in srgb, var(--color-primary) 20%, transparent)",
            }}
          >
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "var(--theme-pattern, none)", backgroundSize: "var(--theme-pattern-size, auto)" }} />
            <div className="relative z-10 flex items-center justify-between p-4 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="size-10 rounded-xl flex items-center justify-center shrink-0 border border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--bg-elevated))]"
                  style={{ background: "color-mix(in srgb, var(--color-primary) 28%, transparent)", color: "var(--color-primary)" }}
                >
                  <Target size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-secondary-fg">
                    Target exam
                  </p>
                  <h4 className="text-[17px] font-black tracking-tight leading-tight truncate text-primary-fg">
                    {state.user.examTarget || "Set target"}
                  </h4>
                </div>
              </div>
              <div className="shrink-0 text-right">
                {state.user.examDate ? (
                  daysLeft !== null ? (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-secondary-fg">
                        Time left
                      </p>
                      <p
                        className={`text-[22px] font-black leading-tight ${
                          daysLeft > 30 ? "text-emerald-400" : daysLeft > 7 ? "text-amber-400" : "text-rose-400"
                        }`}
                      >
                        {daysLeft > 0 ? `${daysLeft}d` : daysLeft === 0 ? "Today!" : "Passed"}
                      </p>
                      <p className="text-[9px] text-secondary-fg font-medium">
                        {new Date(state.user.examDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  ) : null
                ) : (
                  <button
                    onClick={openEditProfile}
                    className="text-[11px] font-bold text-primary underline"
                  >
                    Set date
                  </button>
                )}
              </div>
            </div>
            <div className="relative z-10 px-4 pb-4 -mt-1">
              <p className="text-[13px] font-semibold italic leading-snug text-primary-fg">
                “{displayQuote}”
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              {
                label: "Generate mock test",
                icon: BookOpen,
                onClick: () => navigate("/tests", { state: { openAiModal: true } }),
                tone: "from-blue-500/20 to-cyan-500/10",
              },
              {
                label: "Generate flashcards",
                icon: Sparkles,
                onClick: () => navigate("/flashcards", { state: { openAiModal: true } }),
                tone: "from-purple-500/20 to-fuchsia-500/10",
              },
              {
                label: "Generate formulas",
                icon: FunctionSquare,
                onClick: () => navigate("/flashcards?tab=formulas"),
                tone: "from-amber-500/20 to-orange-500/10",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--border-subtle))] bg-gradient-to-br ${item.tone} p-3 text-left shadow-card active:scale-[0.98] transition-transform`}
                >
                  <div className="size-9 rounded-xl bg-[color-mix(in_srgb,var(--bg-elevated)_85%,transparent)] border border-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] flex items-center justify-center mb-3">
                    <Icon size={16} className="text-primary-fg" />
                  </div>
                  <p className="text-[12px] font-bold text-primary-fg leading-tight">
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* AI shortcuts */}
        {state.user.aiEnabled !== false && (
          <section className="grid grid-cols-1 gap-3 rounded-3xl border border-[color-mix(in_srgb,var(--color-primary)_16%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--bg-elevated)_86%,transparent)] p-4 shadow-card">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/tests", { state: { openAiModal: true } })}
              className="w-full text-left rounded-3xl p-4 bg-gradient-to-r from-blue-500/14 via-cyan-500/10 to-transparent border border-blue-500/20 flex items-center justify-between active:bg-blue-500/15 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-blue-600 dark:text-blue-400">
                    Generate mock test
                  </p>
                  <p className="text-[11px] text-secondary-fg mt-0.5">
                    From prompt, PDF or YouTube
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-blue-500" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/flashcards", { state: { openAiModal: true } })}
              className="w-full text-left rounded-3xl p-4 bg-gradient-to-r from-purple-500/14 via-fuchsia-500/10 to-transparent border border-purple-500/20 flex items-center justify-between active:bg-purple-500/15 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-purple-600 dark:text-purple-400">
                    Generate flashcards
                  </p>
                  <p className="text-[11px] text-secondary-fg mt-0.5">
                    Instantly create cards from any topic
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-purple-500" />
            </motion.button>
          </section>
        )}

        {/* Quick actions */}
        <section className="rounded-3xl border border-[color-mix(in_srgb,var(--color-primary)_16%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--bg-elevated)_86%,transparent)] p-4 shadow-card">
          <span className="manga-headline mb-3">Library</span>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Cards",
                count: totalFlashcards,
                Icon: Layers,
                color: "var(--color-primary)",
                bg: "bg-[var(--color-primary)]/10",
                onClick: () => navigate("/flashcards"),
              },
              {
                label: "Tests",
                count: state.mockTests?.length || 0,
                Icon: BookOpen,
                color: "#3b82f6",
                bg: "bg-blue-500/10",
                onClick: () => navigate("/tests"),
              },
              {
                label: "Formulas",
                count: totalFormulas,
                Icon: FunctionSquare,
                color: "#14b8a6",
                bg: "bg-teal-500/10",
                onClick: () => navigate("/flashcards?tab=formulas"),
              },
            ].map((item) => (
              <motion.button
                key={item.label}
                whileTap={{ scale: 0.95 }}
                onClick={item.onClick}
                className="rounded-2xl p-3 py-4 flex flex-col items-center gap-2 active:scale-[0.98] transition-transform shadow-sm border"
                style={{
                  borderColor: "color-mix(in srgb, var(--color-primary) 14%, var(--border-subtle))",
                  background: "linear-gradient(180deg, color-mix(in srgb, var(--bg-elevated) 94%, transparent) 0%, color-mix(in srgb, var(--bg-surface-2) 60%, transparent) 100%)",
                  boxShadow: "0 8px 24px -16px color-mix(in srgb, var(--color-primary) 35%, transparent)",
                }}
              >
                <div
                  className="size-10 rounded-xl flex items-center justify-center"
                  style={{
                    color: item.color,
                    background: `color-mix(in srgb, ${item.color} 12%, transparent)`,
                    border: "1px solid color-mix(in srgb, currentColor 16%, transparent)",
                  }}
                >
                  <item.Icon size={20} />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-bold leading-none">{item.label}</p>
                  <p className="text-[10px] text-tertiary-fg uppercase tracking-wider mt-1">
                    {item.count} items
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Continue learning */}
        {recentCards.length > 0 && (
          <section className="rounded-3xl border border-[color-mix(in_srgb,var(--color-primary)_16%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--bg-elevated)_86%,transparent)] p-4 shadow-card">
            <div className="flex items-end justify-between mb-3">
              <span className="manga-headline">Continue learning</span>
              <button
                onClick={() => navigate("/flashcards")}
                className="text-[12px] font-semibold text-[var(--color-primary)]"
              >
                View all
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 snap-x">
              {recentCards.map((card) => (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  key={card.id}
                  onClick={() => {
                    setStudyCard(card);
                    setIsFlipped(false);
                  }}
                  className="snap-start flex-none w-[200px] h-32 rounded-2xl p-3 flex flex-col text-left active:scale-[0.98] transition-transform border shadow-sm"
                  style={{
                    background: card.type === "flashcard"
                      ? "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 24%, var(--bg-elevated)) 0%, color-mix(in srgb, var(--bg-elevated) 92%, transparent) 100%)"
                      : "linear-gradient(135deg, color-mix(in srgb, #14b8a6 24%, var(--bg-elevated)) 0%, color-mix(in srgb, var(--bg-elevated) 92%, transparent) 100%)",
                    borderColor: card.type === "flashcard"
                      ? "color-mix(in srgb, var(--color-primary) 18%, var(--border-subtle))"
                      : "color-mix(in srgb, #14b8a6 18%, var(--border-subtle))",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`size-5 rounded-md flex items-center justify-center ${
                        card.type === "flashcard"
                          ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
                          : "bg-teal-500/15 text-teal-500"
                      }`}
                    >
                      {card.type === "flashcard" ? (
                        <Layers size={10} />
                      ) : (
                        <FunctionSquare size={10} />
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-tertiary-fg uppercase tracking-wider truncate">
                      {card.deckName}
                    </span>
                  </div>
                  <p className="font-semibold text-[13px] line-clamp-2 flex-1">
                    {card.front}
                  </p>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {pinnedCards.length > 0 && (
          <section className="rounded-3xl border border-[color-mix(in_srgb,var(--color-primary)_16%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--bg-elevated)_86%,transparent)] p-4 shadow-card">
            <span className="manga-headline mb-3">Pinned</span>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 snap-x">
              {pinnedCards.map((card) => (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  key={card.id}
                  onClick={() => {
                    setStudyCard(card);
                    setIsFlipped(false);
                  }}
                  className="snap-start flex-none w-[200px] h-32 rounded-2xl p-3 flex flex-col text-left border-2 shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 24%, var(--bg-elevated)) 0%, color-mix(in srgb, var(--bg-elevated) 94%, transparent) 100%)",
                    borderColor: "color-mix(in srgb, var(--color-primary) 35%, var(--border-subtle))",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-5 rounded-md bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center">
                      {card.type === "flashcard" ? (
                        <Layers size={10} />
                      ) : (
                        <FunctionSquare size={10} />
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-tertiary-fg uppercase tracking-wider truncate">
                      {card.deckName}
                    </span>
                  </div>
                  <p className="font-semibold text-[13px] line-clamp-2 flex-1">
                    {card.front}
                  </p>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {favouriteCards.length > 0 && (
          <section className="rounded-3xl border border-[color-mix(in_srgb,var(--color-primary)_16%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--bg-elevated)_86%,transparent)] p-4 shadow-card">
            <span className="manga-headline mb-3">Favourites</span>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 snap-x">
              {favouriteCards.map((card) => (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  key={card.id}
                  onClick={() => {
                    setStudyCard(card);
                    setIsFlipped(false);
                  }}
                  className="snap-start flex-none w-[200px] h-32 rounded-2xl p-3 flex flex-col text-left border shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(251,191,36,0.28) 0%, color-mix(in srgb, var(--bg-elevated) 94%, transparent) 100%)",
                    borderColor: "color-mix(in srgb, #fbbf24 34%, var(--border-subtle))",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[9px] font-bold text-tertiary-fg uppercase tracking-wider truncate">
                      {card.deckName}
                    </span>
                  </div>
                  <p className="font-semibold text-[13px] line-clamp-2 flex-1">
                    {card.front}
                  </p>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Decks */}
        <section className="rounded-3xl border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] p-4 shadow-card">
          <div className="flex items-end justify-between mb-3">
            <span className="manga-headline">Your decks</span>
            <button
              onClick={() => navigate("/flashcards")}
              className="text-[12px] font-semibold text-[var(--color-primary)]"
            >
              See all
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 pr-1 snap-x snap-mandatory">
            {state.decks.slice(0, 2).map((deck) => {
              return (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={deck.id}
                  onClick={() =>
                    navigate("/flashcards", { state: { selectedDeckId: deck.id } })
                  }
                  className="relative overflow-hidden rounded-2xl p-3 h-28 w-[78vw] max-w-[260px] flex flex-col justify-between text-left shadow-card snap-start border"
                  style={{
                    background: deck.gradient || getThemeSecondaryButtonGradient(deck.theme || state.user.theme),
                    borderColor: "color-mix(in srgb, var(--color-primary) 18%, var(--border-subtle))",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
                  <div className="relative z-10">
                    <div className="size-7 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                      {deck.type === "flashcard" ? (
                        <Layers size={14} />
                      ) : (
                        <FunctionSquare size={14} />
                      )}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-white font-bold text-sm line-clamp-1">
                      {deck.name}
                    </h4>
                    <p className="text-white/80 text-[11px] font-medium">
                      {deck.cards.length} cards
                    </p>
                  </div>
                </motion.button>
              );
            })}
            <button
              onClick={() => navigate("/flashcards")}
              className="relative overflow-hidden rounded-2xl p-3 h-28 w-[78vw] max-w-[260px] flex flex-col justify-center items-start text-left shadow-card border snap-start"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 12%, var(--bg-elevated)) 0%, color-mix(in srgb, var(--bg-elevated) 94%, transparent) 100%)",
                borderColor: "color-mix(in srgb, var(--color-primary) 18%, var(--border-subtle))",
              }}
            >
              <div className="size-8 rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] flex items-center justify-center text-[var(--color-primary)] mb-3">
                <ChevronRight size={16} />
              </div>
              <p className="text-sm font-bold text-primary-fg">View all</p>
              <p className="text-[11px] text-secondary-fg">Open deck library</p>
            </button>
            {state.decks.length === 0 && (
              <button
                onClick={() => navigate("/flashcards")}
                className="py-10 rounded-2xl border-2 border-dashed border-strong flex flex-col items-center justify-center gap-2 text-tertiary-fg active:bg-surface-2 transition-colors"
              >
                <Plus size={22} />
                <span className="text-sm font-semibold">Create your first deck</span>
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          style={{
            paddingTop: `env(safe-area-inset-top)`,
            paddingBottom: `calc(env(safe-area-inset-bottom) + 100px)`,
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          <div className="bg-elevated border border-subtle rounded-3xl w-full max-w-md overflow-hidden shadow-card-lg max-h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-subtle">
              <h3 className="font-bold text-base">Edit profile</h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="size-8 rounded-full hover:bg-surface-2 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-[11px] font-bold text-tertiary-fg uppercase tracking-wider mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-surface-2 border border-subtle rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-tertiary-fg uppercase tracking-wider mb-1.5">
                  Target exam
                </label>
                <input
                  type="text"
                  value={editExamTarget}
                  onChange={(e) => setEditExamTarget(e.target.value)}
                  placeholder="e.g. NEET, JEE, Boards..."
                  className="w-full bg-surface-2 border border-subtle rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-tertiary-fg uppercase tracking-wider mb-1.5">
                  Avatar
                </label>
                <div className="flex items-center gap-3">
                  <div className="size-14 rounded-2xl border border-subtle overflow-hidden shrink-0 bg-surface-2">
                    <img
                      src={editAvatar}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="w-full text-xs text-tertiary-fg file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[var(--color-primary)]/10 file:text-[var(--color-primary)]"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-tertiary-fg uppercase tracking-wider mb-1.5">
                  Exam date
                </label>
                <input
                  type="date"
                  value={editExamDate}
                  onChange={(e) => setEditExamDate(e.target.value)}
                  className="w-full bg-surface-2 border border-subtle rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-tertiary-fg uppercase tracking-wider mb-1.5">
                  Custom motivation
                </label>
                <textarea
                  value={editCustomQuote}
                  onChange={(e) => setEditCustomQuote(e.target.value)}
                  placeholder="Leave empty for random quotes"
                  className="w-full bg-surface-2 border border-subtle rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none min-h-[80px] resize-none transition-all"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-3 rounded-2xl font-bold bg-surface-2 text-secondary-fg active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-3 rounded-2xl font-bold bg-[var(--color-primary)] text-white shadow-glow active:scale-95 transition-transform"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Study Modal */}
      {studyCard && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          style={{
            paddingTop: `calc(env(safe-area-inset-top, 0px) + 16px)`,
            paddingBottom: `calc(env(safe-area-inset-bottom) + 16px)`,
          }}
          onClick={() => setStudyCard(null)}
        >
          <div
            className="bg-elevated border border-subtle rounded-3xl w-full max-w-md overflow-hidden shadow-card-lg flex flex-col h-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-subtle">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`size-9 rounded-xl flex items-center justify-center ${
                    studyCard.type === "flashcard"
                      ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
                      : "bg-teal-500/15 text-teal-500"
                  }`}
                >
                  {studyCard.type === "flashcard" ? (
                    <Layers size={16} />
                  ) : (
                    <FunctionSquare size={16} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm leading-tight">Quick review</h3>
                  <p className="text-[10px] text-tertiary-fg uppercase tracking-wider truncate">
                    {studyCard.deckName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const deck = state.decks.find((d) => d.id === studyCard.deckId);
                    if (deck) {
                      const updated = deck.cards.map((c) =>
                        c.id === studyCard.id ? { ...c, isPinned: !c.isPinned } : c,
                      );
                      updateDeck(deck.id, { cards: updated });
                      setStudyCard({ ...studyCard, isPinned: !studyCard.isPinned });
                    }
                  }}
                  className={`size-9 rounded-xl flex items-center justify-center transition-colors ${
                    studyCard.isPinned
                      ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                      : "text-tertiary-fg hover:bg-surface-2"
                  }`}
                  aria-label="Pin"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={studyCard.isPinned ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="17" x2="12" y2="22" />
                    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.6V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v4.6a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const deck = state.decks.find((d) => d.id === studyCard.deckId);
                    if (deck) {
                      const updated = deck.cards.map((c) =>
                        c.id === studyCard.id
                          ? { ...c, isFavourite: !c.isFavourite }
                          : c,
                      );
                      updateDeck(deck.id, { cards: updated });
                      setStudyCard({
                        ...studyCard,
                        isFavourite: !studyCard.isFavourite,
                      });
                    }
                  }}
                  className={`size-9 rounded-xl flex items-center justify-center transition-colors ${
                    studyCard.isFavourite
                      ? "text-amber-500 bg-amber-500/10"
                      : "text-tertiary-fg hover:bg-surface-2"
                  }`}
                  aria-label="Favourite"
                >
                  <Star size={18} className={studyCard.isFavourite ? "fill-current" : ""} />
                </button>
                <button
                  onClick={() => setStudyCard(null)}
                  className="size-9 rounded-xl flex items-center justify-center hover:bg-surface-2 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 p-5 flex flex-col items-center justify-center perspective-1000">
              <div
                className={`w-full h-full min-h-0 transition-transform duration-500 transform-style-preserve-3d cursor-pointer relative ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                style={{ minHeight: 280 }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="absolute inset-0 backface-hidden bg-surface-1 border border-subtle rounded-3xl p-6 flex flex-col items-center justify-between text-center shadow-card overflow-y-auto">
                  <p className="text-[10px] text-tertiary-fg font-bold uppercase tracking-widest mb-4">
                    Question
                  </p>
                  <h2 className="text-xl md:text-2xl font-bold leading-tight">
                    {studyCard.front}
                  </h2>
                </div>
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/30 rounded-3xl p-6 flex flex-col items-center justify-between text-center overflow-y-auto shadow-card">
                  <p className="text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-widest mb-4">
                    Answer
                  </p>
                  <h2 className="text-lg md:text-xl font-medium leading-relaxed">
                    {studyCard.back}
                  </h2>
                  {studyCard.image && (
                    <div className="mt-4 w-full max-h-60 rounded-2xl overflow-hidden border border-[var(--color-primary)]/20">
                      <img
                        src={studyCard.image}
                        alt=""
                        className="w-full h-full object-contain bg-surface-2"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  {studyCard.notes && (
                    <div className="mt-4 p-3 bg-surface-2 rounded-2xl text-xs italic text-secondary-fg w-full">
                      {studyCard.notes}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="mt-4 text-[11px] text-secondary-fg font-bold flex items-center gap-2 bg-surface-2 px-4 py-2 rounded-full"
              >
                <RefreshCw size={12} className={isFlipped ? "rotate-180" : ""} />
                Tap to flip
              </button>
            </div>

            <div className="p-4 border-t border-subtle flex gap-3">
              <button
                onClick={() => setStudyCard(null)}
                className="flex-1 py-3 rounded-2xl font-bold bg-surface-2 text-secondary-fg flex items-center justify-center gap-2 text-sm"
              >
                <XCircle size={16} /> Review
              </button>
              <button
                onClick={() => setStudyCard(null)}
                className="flex-1 py-3 rounded-2xl font-bold bg-emerald-500 text-white flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 size={16} /> Mastered
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </motion.div>
  );
};

export default Home;
