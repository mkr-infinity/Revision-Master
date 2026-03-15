import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flame,
  Layers,
  BookOpen,
  FunctionSquare,
  Trophy,
  X,
  Edit2,
  Calendar,
  Quote,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Star,
  Target,
  Plus
} from "lucide-react";
import { useAppContext, Card } from "../context/AppContext";

import AppLogo from "../components/AppLogo";

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
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Sometimes later becomes never. Do it now.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it."
];

const RANDOM_MESSAGES = [
  "Hope you are upgrading or going towards your goal!",
  "Every step counts. Keep pushing forward!",
  "Small daily improvements lead to stunning results.",
  "Your future self will thank you for today's effort.",
  "Consistency is the key to mastery.",
  "Focus on the process, the results will follow.",
  "You are closer to your goal than you were yesterday.",
  "Embrace the challenge, it's making you stronger.",
  "Stay focused, stay determined, stay unstoppable.",
  "Believe in your potential and keep learning."
];

const getISTGreeting = () => {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const nd = new Date(utc + (3600000 * 5.5)); // IST is +5:30
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

  const [studyCard, setStudyCard] = useState<(Card & { deckName: string, deckId: string, type: string }) | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcardDecks = state.decks.filter(d => d.type === "flashcard");
  const formulaDecks = state.decks.filter(d => d.type === "formula");
  const totalFlashcards = flashcardDecks.reduce((acc, deck) => acc + deck.cards.length, 0);
  const totalFormulas = formulaDecks.reduce((acc, deck) => acc + deck.cards.length, 0);

  const getDaysLeft = (targetDate: string) => {
    if (!targetDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft(state.user.examDate || "");

  const allCards = state.decks.flatMap(d => d.cards.map(c => ({ ...c, deckName: d.name, deckId: d.id, type: d.type })));
  const recentCards = allCards.slice(-5).reverse(); // Last 5 added
  const favouriteCards = allCards.filter(c => c.isFavourite);
  const pinnedCards = allCards.filter(c => c.isPinned);

  const cardThemes = [
    { id: "default", name: "Default", color: "bg-white dark:bg-slate-900" },
    { id: "blue", name: "Blue", color: "bg-blue-50 dark:bg-blue-900/20" },
    { id: "green", name: "Green", color: "bg-emerald-50 dark:bg-emerald-900/20" },
    { id: "yellow", name: "Yellow", color: "bg-amber-50 dark:bg-amber-900/20" },
    { id: "purple", name: "Purple", color: "bg-purple-50 dark:bg-purple-900/20" },
    { id: "rose", name: "Rose", color: "bg-rose-50 dark:bg-rose-900/20" },
  ];

  const greeting = useMemo(() => getISTGreeting(), []);
  const randomQuote = useMemo(() => DEFAULT_QUOTES[Math.floor(Math.random() * DEFAULT_QUOTES.length)], []);
  const randomMessage = useMemo(() => RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)], []);
  const displayQuote = state.user.customQuote || randomQuote;

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    updateUser({ 
      name: editName, 
      examTarget: editExamTarget,
      avatar: editAvatar,
      examDate: editExamDate,
      customQuote: editCustomQuote
    });
    setShowEditProfile(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="font-display text-slate-900 dark:text-slate-100 pb-24"
    >
      <header className="p-6 pt-8 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <motion.div whileTap={{ scale: 0.9 }} className="relative group cursor-pointer" onClick={() => {
            setEditName(state.user.name);
            setEditExamTarget(state.user.examTarget);
            setEditAvatar(state.user.avatar);
            setEditExamDate(state.user.examDate || "");
            setEditCustomQuote(state.user.customQuote || "");
            setShowEditProfile(true);
          }}>
            <div className="size-12 rounded-full border-2 border-primary p-0.5 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={state.user.avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Edit2 size={14} className="text-white" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-[8px] text-white font-black px-1 py-0.5 rounded-full border-2 border-background-dark">
              LV {state.user.level}
            </div>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {greeting}, {state.user.name || "Scholar"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Ready to master your subjects?
            </p>
          </div>
        </div>
        <AppLogo className="w-10 h-10 rounded-xl shadow-md" />
      </header>

      <main className="px-6 space-y-6">
        <section className="bg-primary/5 border border-primary/20 rounded-xl p-4 relative overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Flame size={24} className="text-orange-500 fill-orange-500" />
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Daily Streak
                </p>
                <h2 className="text-xl font-bold italic tracking-tighter">
                  {state.streak.current} DAYS
                </h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-sm">
                +{state.user.xp} XP
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
                Next: {Math.max(20, state.streak.current + 5)} Days
              </p>
            </div>
          </div>

          <div className="flex gap-1 mt-3">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i < (state.streak.current % 7 || 7) ? "bg-primary shadow-[0_0_8px_rgba(127,19,236,0.6)]" : "bg-slate-200 dark:bg-slate-700"}`}
              ></div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold tracking-tight">Current Goal</h3>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="text-primary text-sm font-bold bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
              onClick={() => {
                setEditName(state.user.name);
                setEditExamTarget(state.user.examTarget);
                setEditAvatar(state.user.avatar);
                setEditExamDate(state.user.examDate || "");
                setEditCustomQuote(state.user.customQuote || "");
                setShowEditProfile(true);
              }}
            >
              <Edit2 size={14} /> Edit
            </motion.button>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-xl border border-slate-700/50">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Left side: Target Info */}
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/30">
                    <Target className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Target Exam</p>
                    <h4 className="text-2xl font-black text-white tracking-tight leading-none">
                      {state.user.examTarget || "Set Target Exam"}
                    </h4>
                  </div>
                </div>

                {state.user.examDate && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Calendar size={20} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Exam Date</p>
                        <p className="text-white font-medium text-sm">
                          {new Date(state.user.examDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    {daysLeft !== null && (
                      <div className="text-right">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Time Left</p>
                        <p className={`text-lg font-black ${daysLeft > 30 ? 'text-emerald-400' : daysLeft > 7 ? 'text-amber-400' : 'text-red-400'}`}>
                          {daysLeft > 0 ? `${daysLeft}d` : daysLeft === 0 ? 'Today' : 'Passed'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {!state.user.examTarget && (
                  <p className="text-slate-400 text-xs mt-2">
                    Set your target exam to track your progress
                  </p>
                )}
              </div>

              {/* Right side: Quote */}
              <div className="w-full md:w-1/2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 relative">
                <Quote className="absolute top-3 left-3 text-white/10" size={32} />
                <p className="text-sm italic text-slate-400 relative z-10 pl-6 pr-2 py-2 leading-relaxed">
                  "{displayQuote}"
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                  <Sparkles size={14} className="text-teal-400" />
                  <p className="text-xs font-medium text-teal-400">
                    {randomMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>



        <section>
          <h3 className="text-lg font-bold mb-3">Quick Actions</h3>
          {state.user.aiEnabled !== false && (
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/tests", { state: { openAiModal: true } })}
              className="w-full bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between hover:border-blue-500/60 transition-all cursor-pointer group mb-3"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="text-blue-500" size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm text-blue-600 dark:text-blue-400">Generate Mock Test with AI</p>
                  <p className="text-xs text-slate-500 mt-0.5">Create tests from prompt, PDF, or YouTube</p>
                </div>
              </div>
              <div className="size-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={16} />
              </div>
            </motion.div>
          )}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/flashcards")}
              className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center gap-2 py-4 hover:border-primary/60 transition-all cursor-pointer"
            >
              <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Layers className="text-primary" size={20} />
              </div>
              <div className="text-center">
                <p className="font-bold text-xs">Flashcards</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{totalFlashcards} Cards</p>
              </div>
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/tests")}
              className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center gap-2 py-4 hover:border-primary/60 transition-all cursor-pointer"
            >
              <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <BookOpen className="text-blue-500" size={20} />
              </div>
              <div className="text-center">
                <p className="font-bold text-xs">Mock Tests</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{state.mockTests?.length || 0} Tests</p>
              </div>
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/formulas")}
              className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center gap-2 py-4 hover:border-primary/60 transition-all cursor-pointer"
            >
              <div className="size-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <FunctionSquare className="text-teal-500" size={20} />
              </div>
              <div className="text-center">
                <p className="font-bold text-xs">Formulas</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{totalFormulas} Items</p>
              </div>
            </motion.div>
          </div>
          {state.user.aiEnabled !== false && (
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/flashcards", { state: { openAiModal: true } })}
              className="w-full bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between hover:border-purple-500/60 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="text-purple-500" size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm text-purple-600 dark:text-purple-400">Generate Cards with MKR Ai</p>
                  <p className="text-xs text-slate-500 mt-0.5">Instantly create flashcards from any topic</p>
                </div>
              </div>
              <div className="size-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={16} />
              </div>
            </motion.div>
          )}
        </section>

        {recentCards.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-lg font-bold">Continue Learning</h3>
              <span
                className="text-primary text-sm font-semibold cursor-pointer"
                onClick={() => navigate("/flashcards")}
              >
                View All
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
              {recentCards.map((card) => {
                const themeClass = cardThemes.find(t => t.id === card.theme)?.color || cardThemes[0].color;
                return (
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    key={card.id} 
                    onClick={() => {
                      setStudyCard(card);
                      setIsFlipped(false);
                    }}
                    className={`min-w-[200px] max-w-[200px] snap-center ${themeClass} border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm cursor-pointer hover:border-primary/50 transition-colors flex flex-col h-32`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`size-5 rounded flex items-center justify-center ${card.type === 'flashcard' ? 'bg-primary/10 text-primary' : 'bg-teal-500/10 text-teal-500'}`}>
                        {card.type === 'flashcard' ? <Layers size={10} /> : <FunctionSquare size={10} />}
                      </div>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider truncate">
                        {card.deckName}
                      </span>
                    </div>
                    <p className="font-bold text-xs line-clamp-2 mb-1">{card.front}</p>
                    <div className="mt-auto pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-[10px] text-slate-700 dark:text-slate-400 line-clamp-2">{card.back}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {pinnedCards.length > 0 && (
          <section className="mt-4">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-lg font-bold">Pinned Cards</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
              {pinnedCards.map((card) => {
                const themeClass = cardThemes.find(t => t.id === card.theme)?.color || cardThemes[0].color;
                return (
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    key={card.id} 
                    onClick={() => {
                      setStudyCard(card);
                      setIsFlipped(false);
                    }}
                    className={`min-w-[200px] max-w-[200px] snap-center ${themeClass} border-2 border-primary/50 rounded-xl p-3 shadow-sm cursor-pointer hover:border-primary transition-colors flex flex-col h-32`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`size-5 rounded flex items-center justify-center ${card.type === 'flashcard' ? 'bg-primary/10 text-primary' : 'bg-teal-500/10 text-teal-500'}`}>
                        {card.type === 'flashcard' ? <Layers size={10} /> : <FunctionSquare size={10} />}
                      </div>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider truncate">
                        {card.deckName}
                      </span>
                    </div>
                    <p className="font-bold text-xs line-clamp-2 mb-1">{card.front}</p>
                    <div className="mt-auto pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-[10px] text-slate-700 dark:text-slate-400 line-clamp-2">{card.back}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {favouriteCards.length > 0 && (
          <section className="mt-4">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-lg font-bold">Favourite Cards</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
              {favouriteCards.map((card) => {
                const themeClass = cardThemes.find(t => t.id === card.theme)?.color || cardThemes[0].color;
                return (
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    key={card.id} 
                    onClick={() => {
                      setStudyCard(card);
                      setIsFlipped(false);
                    }}
                    className={`min-w-[200px] max-w-[200px] snap-center ${themeClass} border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm cursor-pointer hover:border-primary/50 transition-colors flex flex-col h-32`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`size-5 rounded flex items-center justify-center ${card.type === 'flashcard' ? 'bg-primary/10 text-primary' : 'bg-teal-500/10 text-teal-500'}`}>
                        {card.type === 'flashcard' ? <Layers size={10} /> : <FunctionSquare size={10} />}
                      </div>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider truncate">
                        {card.deckName}
                      </span>
                    </div>
                    <p className="font-bold text-xs line-clamp-2 mb-1">{card.front}</p>
                    <div className="mt-auto pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-[10px] text-slate-700 dark:text-slate-400 line-clamp-2">{card.back}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-lg font-bold">Your Decks</h3>
            <span
              className="text-primary text-sm font-semibold cursor-pointer"
              onClick={() => navigate("/flashcards")}
            >
              See All
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {state.decks.slice(0, 4).map((deck) => {
              const isCustomGradient = deck.gradient?.startsWith("linear-gradient");
              return (
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  key={deck.id}
                  onClick={() => navigate("/flashcards", { state: { selectedDeckId: deck.id } })}
                  className={`relative overflow-hidden rounded-xl p-3 h-24 flex flex-col justify-between shadow-sm ${!isCustomGradient ? deck.gradient : ''}`}
                  style={isCustomGradient ? { background: deck.gradient } : {}}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="size-6 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      {deck.type === 'flashcard' ? <Layers size={12} /> : <FunctionSquare size={12} />}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-white font-bold text-xs line-clamp-1">{deck.name}</h4>
                    <p className="text-white/80 text-[10px] font-medium">{deck.cards.length} Cards</p>
                  </div>
                </motion.div>
              );
            })}
            {state.decks.length === 0 && (
              <div 
                onClick={() => navigate("/flashcards")}
                className="col-span-2 py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <Plus size={24} />
                <span className="text-sm font-bold">Create your first deck</span>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background-light dark:bg-background-dark border border-primary/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-primary/10">
              <h3 className="font-bold text-lg">Edit Profile</h3>
              <button 
                onClick={() => setShowEditProfile(false)}
                className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Exam</label>
                <input 
                  type="text" 
                  value={editExamTarget}
                  onChange={(e) => setEditExamTarget(e.target.value)}
                  placeholder="e.g. NEET, JEE, Boards..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avatar Image</label>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full border border-primary/20 overflow-hidden shrink-0">
                    <img src={editAvatar} alt="Avatar Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <input 
                    type="text" 
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="Or paste image URL"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Exam Date</label>
                <input 
                  type="date" 
                  value={editExamDate}
                  onChange={(e) => setEditExamDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Motivation Quote</label>
                <textarea 
                  value={editCustomQuote}
                  onChange={(e) => setEditCustomQuote(e.target.value)}
                  placeholder="Leave empty for random quotes"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none min-h-[80px] resize-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-primary text-white"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Study Modal */}
      {studyCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background-light dark:bg-background-dark border border-primary/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[750px]">
            <div className="flex items-center justify-between p-4 border-b border-primary/10">
              <div className="flex items-center gap-2">
                <div className={`size-8 rounded flex items-center justify-center ${studyCard.type === 'flashcard' ? 'bg-primary/10 text-primary' : 'bg-teal-500/10 text-teal-500'}`}>
                  {studyCard.type === 'flashcard' ? <Layers size={16} /> : <FunctionSquare size={16} />}
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Quick Review</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{studyCard.deckName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const deck = state.decks.find(d => d.id === studyCard.deckId);
                    if (deck) {
                      const updatedCards = deck.cards.map(c => 
                        c.id === studyCard.id ? { ...c, isPinned: !c.isPinned } : c
                      );
                      updateDeck(deck.id, { cards: updatedCards });
                      setStudyCard({ ...studyCard, isPinned: !studyCard.isPinned });
                    }
                  }}
                  className={`p-1 rounded-lg transition-colors ${studyCard.isPinned ? 'text-primary hover:bg-primary/10' : 'text-slate-400 hover:bg-slate-500/10'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={studyCard.isPinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.6V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v4.6a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const deck = state.decks.find(d => d.id === studyCard.deckId);
                    if (deck) {
                      const updatedCards = deck.cards.map(c => 
                        c.id === studyCard.id ? { ...c, isFavourite: !c.isFavourite } : c
                      );
                      updateDeck(deck.id, { cards: updatedCards });
                      setStudyCard({ ...studyCard, isFavourite: !studyCard.isFavourite });
                    }
                  }}
                  className={`p-1 rounded-lg transition-colors ${studyCard.isFavourite ? 'text-amber-500 hover:bg-amber-500/10' : 'text-slate-400 hover:bg-slate-500/10'}`}
                >
                  <Star size={20} className={studyCard.isFavourite ? "fill-current" : ""} />
                </button>
                <button 
                  onClick={() => setStudyCard(null)}
                  className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center relative perspective-1000">
              <div 
                className={`w-full h-full transition-all duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''} shadow-2xl rounded-xl relative`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-inner">
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-6">Question</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{studyCard.front}</h2>
                </div>
                
                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-inner overflow-y-auto">
                  <p className="text-sm text-primary font-bold uppercase tracking-widest mb-6">Answer</p>
                  <h2 className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed">{studyCard.back}</h2>
                  {studyCard.image && (
                    <div className="mt-6 w-full max-h-60 rounded-xl overflow-hidden border-2 border-primary/20 shadow-md">
                      <img src={studyCard.image} alt="Card visual" className="w-full h-full object-contain bg-white/50 dark:bg-black/50" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  {studyCard.notes && (
                    <div className="mt-6 p-4 bg-white/60 dark:bg-black/40 rounded-xl text-sm italic text-slate-700 dark:text-slate-400 w-full border border-primary/10 shadow-sm">
                      {studyCard.notes}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tap to flip indicator - moved outside the card box */}
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="text-xs text-slate-500 font-bold flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-full transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  <RefreshCw size={14} className={isFlipped ? "rotate-180 transition-transform duration-500" : "transition-transform duration-500"} /> 
                  Tap to flip card
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-primary/10 flex gap-3">
              <button 
                onClick={() => setStudyCard(null)}
                className="flex-1 py-2 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 flex items-center justify-center gap-2 text-sm"
              >
                <XCircle size={16} /> Needs Review
              </button>
              <button 
                onClick={() => setStudyCard(null)}
                className="flex-1 py-2 rounded-xl font-bold bg-emerald-500 text-white flex items-center justify-center gap-2 text-sm"
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
