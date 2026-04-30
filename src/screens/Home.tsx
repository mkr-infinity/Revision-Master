import React, { useEffect, useState, useMemo } from "react";
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

const Home = () => {
  const navigate = useNavigate();
  const { state, updateStreak, updateUser, updateDeck } = useAppContext();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="font-display text-primary-fg pb-6 home-screen-bg relative"
    >
      {/* Header */}
      <header
        className="px-5 pb-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl home-header-bg"
        style={{ paddingTop: `calc(env(safe-area-inset-top) + 18px)` }}
      >
        <button
          onClick={openEditProfile}
          className="flex items-center gap-3 group active:scale-95 transition-transform"
        >
          <div className="relative">
            <div className="size-11 rounded-2xl overflow-hidden bg-surface-2 ring-2 ring-[var(--color-primary)]/30">
              <img
                src={state.user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {state.user.level > 1 && (
              <div className="absolute -bottom-1 -right-1 bg-[var(--color-primary)] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-glow">
                Lv {state.user.level}
              </div>
            )}
          </div>
          <div className="text-left">
            <p className="text-[11px] text-tertiary-fg font-medium leading-tight">
              {greeting}
            </p>
            <h1 className="font-anime-pop text-[18px] leading-tight tracking-tight">
              {state.user.name || "Scholar"}
              <span className="ml-1 text-[13px]">★</span>
            </h1>
          </div>
        </button>

        <button
          onClick={() => navigate("/stats")}
          className="size-11 rounded-2xl glass flex items-center justify-center text-secondary-fg active:scale-95 transition-transform"
          aria-label="Stats"
        >
          <Sparkles size={18} />
        </button>
      </header>

      <main className="px-5 pt-3 space-y-5">
        {/* Streak hero */}
        <section className="relative overflow-hidden rounded-3xl p-5 gradient-violet text-white shadow-glow">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-6 w-40 h-40 rounded-full bg-black/20 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                  <Flame size={22} className="text-white fill-white/90" />
                </div>
                <div>
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                    Daily streak
                  </p>
                  <p className="text-3xl font-black leading-none mt-1 tracking-tight">
                    {state.streak.current}{" "}
                    <span className="text-base font-bold text-white/80">days</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                  XP
                </p>
                <p className="text-xl font-black leading-none mt-1">
                  {state.user.xp}
                </p>
              </div>
            </div>

            <div className="flex gap-1.5">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i < streakProgress ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-white/70 mt-3 font-medium">
              Best streak: {state.streak.max} days · keep it going
            </p>
          </div>
        </section>

        {/* Goal card */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <span className="manga-headline">Current goal</span>
            <button
              onClick={openEditProfile}
              className="text-[12px] font-semibold text-[var(--color-primary)] flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Edit2 size={12} /> Edit
            </button>
          </div>

          <div className="rounded-3xl p-5 bg-surface-1 border border-subtle shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] flex items-center justify-center shadow-glow">
                <Target className="text-white" size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-tertiary-fg text-[10px] font-bold uppercase tracking-widest">
                  Target exam
                </p>
                <h4 className="text-xl font-black tracking-tight truncate">
                  {state.user.examTarget || "Set target"}
                </h4>
              </div>
            </div>

            {state.user.examDate ? (
              <div className="rounded-2xl bg-surface-2 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-secondary-fg" />
                  <div>
                    <p className="text-[10px] text-tertiary-fg font-bold uppercase tracking-wider">
                      Exam date
                    </p>
                    <p className="text-sm font-semibold">
                      {new Date(state.user.examDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {daysLeft !== null && (
                  <div className="text-right">
                    <p className="text-[10px] text-tertiary-fg font-bold uppercase tracking-wider">
                      Time left
                    </p>
                    <p
                      className={`text-lg font-black ${
                        daysLeft > 30
                          ? "text-emerald-500"
                          : daysLeft > 7
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                    >
                      {daysLeft > 0 ? `${daysLeft}d` : daysLeft === 0 ? "Today" : "Passed"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-surface-2 p-4 text-center text-secondary-fg text-sm">
                Set your exam date to track time left
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-subtle">
              <p className="text-[12px] italic text-secondary-fg leading-relaxed">
                "{displayQuote}"
              </p>
            </div>
          </div>
        </section>

        {/* AI shortcuts */}
        {state.user.aiEnabled !== false && (
          <section className="grid grid-cols-1 gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/tests", { state: { openAiModal: true } })}
              className="w-full text-left rounded-3xl p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 flex items-center justify-between active:bg-blue-500/15 transition-colors"
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
              className="w-full text-left rounded-3xl p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 flex items-center justify-between active:bg-purple-500/15 transition-colors"
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
        <section>
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
                className="rounded-2xl bg-surface-1 border border-subtle p-3 py-4 flex flex-col items-center gap-2 active:bg-surface-2 transition-colors"
              >
                <div
                  className={`size-10 rounded-xl flex items-center justify-center ${item.bg}`}
                  style={{ color: item.color }}
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
          <section>
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
                  className="snap-start flex-none w-[200px] h-32 rounded-2xl bg-surface-1 border border-subtle p-3 flex flex-col text-left active:bg-surface-2 transition-colors"
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
                  <p className="font-semibold text-[13px] line-clamp-3 flex-1">
                    {card.front}
                  </p>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {pinnedCards.length > 0 && (
          <section>
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
                  className="snap-start flex-none w-[200px] h-32 rounded-2xl bg-surface-1 border-2 border-[var(--color-primary)]/40 p-3 flex flex-col text-left"
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
                  <p className="font-semibold text-[13px] line-clamp-3 flex-1">
                    {card.front}
                  </p>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {favouriteCards.length > 0 && (
          <section>
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
                  className="snap-start flex-none w-[200px] h-32 rounded-2xl bg-surface-1 border border-amber-500/30 p-3 flex flex-col text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[9px] font-bold text-tertiary-fg uppercase tracking-wider truncate">
                      {card.deckName}
                    </span>
                  </div>
                  <p className="font-semibold text-[13px] line-clamp-3 flex-1">
                    {card.front}
                  </p>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Decks */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <span className="manga-headline">Your decks</span>
            <button
              onClick={() => navigate("/flashcards")}
              className="text-[12px] font-semibold text-[var(--color-primary)]"
            >
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {state.decks.slice(0, 4).map((deck) => {
              const isCustomGradient = deck.gradient?.startsWith("linear-gradient");
              return (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={deck.id}
                  onClick={() =>
                    navigate("/flashcards", { state: { selectedDeckId: deck.id } })
                  }
                  className={`relative overflow-hidden rounded-2xl p-3 h-28 flex flex-col justify-between text-left shadow-card ${
                    !isCustomGradient ? deck.gradient : ""
                  }`}
                  style={isCustomGradient ? { background: deck.gradient } : {}}
                >
                  <div className="absolute inset-0 bg-black/15" />
                  <div className="relative z-10">
                    <div className="size-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
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
            {state.decks.length === 0 && (
              <button
                onClick={() => navigate("/flashcards")}
                className="col-span-2 py-10 rounded-2xl border-2 border-dashed border-strong flex flex-col items-center justify-center gap-2 text-tertiary-fg active:bg-surface-2 transition-colors"
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
      {studyCard && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          style={{
            paddingTop: `calc(env(safe-area-inset-top) + 16px)`,
            paddingBottom: `calc(env(safe-area-inset-bottom) + 16px)`,
          }}
          onClick={() => setStudyCard(null)}
        >
          <div
            className="bg-elevated border border-subtle rounded-3xl w-full max-w-md overflow-hidden shadow-card-lg flex flex-col max-h-full"
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

            <div className="flex-1 p-5 flex flex-col items-center justify-center perspective-1000">
              <div
                className={`w-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer relative ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                style={{ minHeight: 280 }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="absolute inset-0 backface-hidden bg-surface-1 border border-subtle rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-card">
                  <p className="text-[10px] text-tertiary-fg font-bold uppercase tracking-widest mb-4">
                    Question
                  </p>
                  <h2 className="text-xl md:text-2xl font-bold leading-tight">
                    {studyCard.front}
                  </h2>
                </div>
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center overflow-y-auto shadow-card">
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
      )}
    </motion.div>
  );
};

export default Home;
