import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Bell,
  TrendingUp,
  BarChart,
  Activity,
  AlertTriangle,
  BookOpen,
  FunctionSquare,
  CheckCircle,
  XCircle,
  X,
  Clock,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Stats = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const stats = state.testStats;

  const totalFlashcards = state.decks
    .filter((d) => d.type === "flashcard")
    .reduce((acc, deck) => acc + deck.cards.length, 0);
  const totalFormulas = state.decks
    .filter((d) => d.type === "formula")
    .reduce((acc, deck) => acc + deck.cards.length, 0);

  // ---- Aggregate real test data --------------------------------------------
  const cardsAnswered = stats.cardCorrect + stats.cardWrong;

  // Card-level accuracy split by deck type.
  const flashAgg = { c: 0, w: 0 };
  const formAgg = { c: 0, w: 0 };
  state.decks.forEach((d) => {
    const s = stats.byDeck[d.id];
    if (!s) return;
    if (d.type === "flashcard") {
      flashAgg.c += s.correct;
      flashAgg.w += s.wrong;
    } else {
      formAgg.c += s.correct;
      formAgg.w += s.wrong;
    }
  });

  const flashcardAccuracy =
    flashAgg.c + flashAgg.w > 0
      ? Math.round((flashAgg.c / (flashAgg.c + flashAgg.w)) * 100)
      : 0;
  const formulaAccuracy =
    formAgg.c + formAgg.w > 0
      ? Math.round((formAgg.c / (formAgg.c + formAgg.w)) * 100)
      : 0;

  // Mock tests roll into the totals too.
  const mockCorrect = stats.mockResults.reduce((s, r) => s + r.correct, 0);
  const mockWrong = stats.mockResults.reduce(
    (s, r) => s + r.wrong + r.skipped,
    0,
  );
  const totalCorrect = stats.cardCorrect + mockCorrect;
  const totalWrong = stats.cardWrong + mockWrong;
  const overallAccuracy =
    totalCorrect + totalWrong > 0
      ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
      : 0;

  // Recent trend = last mock test vs the one before it.
  const trend = useMemo(() => {
    const last = stats.mockResults[0];
    const prev = stats.mockResults[1];
    if (!last) return null;
    const lastAcc = last.total > 0 ? Math.round((last.correct / last.total) * 100) : 0;
    if (!prev) return { delta: 0, lastAcc };
    const prevAcc = prev.total > 0 ? Math.round((prev.correct / prev.total) * 100) : 0;
    return { delta: lastAcc - prevAcc, lastAcc };
  }, [stats.mockResults]);

  const strokeDashoffset = 440 - (440 * overallAccuracy) / 100;

  // ---- Per-deck breakdown for strong/weak areas ----------------------------
  const deckBreakdown = useMemo(() => {
    return state.decks
      .map((d) => {
        const s = stats.byDeck[d.id];
        const seen = (s?.correct || 0) + (s?.wrong || 0);
        const acc = seen > 0 ? Math.round(((s?.correct || 0) / seen) * 100) : null;
        return { deck: d, seen, acc };
      })
      .filter((x) => x.seen > 0)
      .sort((a, b) => (b.acc ?? -1) - (a.acc ?? -1));
  }, [state.decks, stats.byDeck]);

  const flashcardDecks = deckBreakdown.filter((x) => x.deck.type === "flashcard");
  const formulaDecks = deckBreakdown.filter((x) => x.deck.type === "formula");

  const weakDecks = useMemo(
    () =>
      [...deckBreakdown]
        .filter((x) => x.acc !== null && x.acc < 70)
        .sort((a, b) => (a.acc ?? 100) - (b.acc ?? 100))
        .slice(0, 4),
    [deckBreakdown],
  );

  // ---- Weekly activity from real `daily` map -------------------------------
  const weekly = useMemo(() => {
    const out: { label: string; count: number; isToday: boolean }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      out.push({
        label: DAY_LABELS[d.getDay()],
        count: stats.daily[key] || 0,
        isToday: i === 0,
      });
    }
    return out;
  }, [stats.daily]);

  const maxWeekly = Math.max(1, ...weekly.map((w) => w.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="min-h-screen font-display text-slate-900 dark:text-slate-100 flex flex-col pb-24"
    >
      <header className="sticky top-0 z-50 px-4 pb-2.5" style={{ paddingTop: `calc(env(safe-area-inset-top) + 6px)` }}>
        <div className="flex items-center justify-between backdrop-blur-xl bg-elevated/60 border border-white/[0.08] shadow-md shadow-black/10 rounded-[1.35rem] px-3.5 py-2">
          <button
            onClick={() => navigate(-1)}
            className="size-10 rounded-2xl bg-white/35 dark:bg-white/8 border border-white/[0.10] shadow-sm flex items-center justify-center text-primary hover:bg-primary/10 transition-colors mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 flex items-center justify-between">
            <h1 className="font-bold text-lg tracking-tight truncate text-primary-fg">
              Learning Analytics
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotifications(true)}
                className="size-10 rounded-full bg-primary/10 text-primary relative flex items-center justify-center"
              >
                <Bell size={20} />
                {state.activityLog?.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full"></span>
                )}
              </button>
              <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden bg-surface-2">
                <img
                  src={state.user.avatar}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {cardsAnswered === 0 && stats.mockResults.length === 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm">No data yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Review some cards or take a mock test — your real numbers will start showing up here.
              </p>
            </div>
          </div>
        )}

        <section className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>

          <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
            <div className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
              <BookOpen size={24} className="text-blue-500" />
              <div className="text-center">
                <p className="text-2xl font-bold">{totalFlashcards}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Total Flashcards
                </p>
              </div>
            </div>
            <div className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
              <FunctionSquare size={24} className="text-teal-500" />
              <div className="text-center">
                <p className="text-2xl font-bold">{totalFormulas}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Total Formulas
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Overall Accuracy
            </p>
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  className="text-primary/10"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                ></circle>
                <circle
                  className="text-primary drop-shadow-[0_0_8px_rgba(127,19,236,0.8)]"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="70"
                  stroke="currentColor"
                  strokeDasharray="440"
                  strokeDashoffset={strokeDashoffset}
                  strokeWidth="10"
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{overallAccuracy}%</span>
                {trend ? (
                  <span
                    className={`text-sm font-semibold flex items-center ${
                      trend.delta > 0
                        ? "text-teal-500"
                        : trend.delta < 0
                          ? "text-red-500"
                          : "text-slate-500"
                    }`}
                  >
                    <TrendingUp
                      size={14}
                      className={`mr-1 ${trend.delta < 0 ? "rotate-180" : ""}`}
                    />
                    {trend.delta > 0 ? "+" : ""}
                    {trend.delta}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">No trend yet</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="size-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Correct
                  </p>
                  <p className="text-lg font-bold text-teal-500">
                    {totalCorrect.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                  <XCircle size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Wrong
                  </p>
                  <p className="text-lg font-bold text-red-500">
                    {totalWrong.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Accuracy by Type</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium flex items-center gap-2">
                  <BookOpen size={14} className="text-blue-500" /> Flashcards
                </span>
                <span className="font-bold">{flashcardAccuracy}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${flashcardAccuracy}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium flex items-center gap-2">
                  <FunctionSquare size={14} className="text-teal-500" /> Formulas
                </span>
                <span className="font-bold">{formulaAccuracy}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all"
                  style={{ width: `${formulaAccuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BarChart className="text-primary" size={20} /> Strong & Weak Areas
          </h2>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-4 text-slate-500 uppercase tracking-wider">
                Flashcards
              </h3>
              {flashcardDecks.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Review flashcards to see your top and weakest decks here.
                </p>
              ) : (
                <div className="space-y-4">
                  {flashcardDecks.slice(0, 4).map(({ deck, acc }) => {
                    const a = acc ?? 0;
                    const color =
                      a >= 80
                        ? "bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                        : a >= 50
                          ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                          : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
                    const tag =
                      a >= 80 ? "Strong" : a >= 50 ? "Improving" : "Weak";
                    const tagColor =
                      a >= 80
                        ? "text-teal-500"
                        : a >= 50
                          ? "text-amber-500"
                          : "text-red-500";
                    return (
                      <div key={deck.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium truncate pr-2">
                            {deck.name}{" "}
                            <span
                              className={`text-[10px] uppercase font-bold ${tagColor}`}
                            >
                              ({tag})
                            </span>
                          </span>
                          <span className={`font-bold ${tagColor}`}>{a}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${color}`}
                            style={{ width: `${a}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-primary/10">
              <h3 className="text-sm font-semibold mb-4 text-slate-500 uppercase tracking-wider">
                Formulas
              </h3>
              {formulaDecks.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Review formula decks to fill this section in.
                </p>
              ) : (
                <div className="space-y-4">
                  {formulaDecks.slice(0, 4).map(({ deck, acc }) => {
                    const a = acc ?? 0;
                    const color =
                      a >= 80
                        ? "bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                        : a >= 50
                          ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                          : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
                    const tag =
                      a >= 80 ? "Strong" : a >= 50 ? "Improving" : "Weak";
                    const tagColor =
                      a >= 80
                        ? "text-teal-500"
                        : a >= 50
                          ? "text-amber-500"
                          : "text-red-500";
                    return (
                      <div key={deck.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium truncate pr-2">
                            {deck.name}{" "}
                            <span
                              className={`text-[10px] uppercase font-bold ${tagColor}`}
                            >
                              ({tag})
                            </span>
                          </span>
                          <span className={`font-bold ${tagColor}`}>{a}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${color}`}
                            style={{ width: `${a}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="text-blue-500" size={20} /> Weekly Activity
          </h2>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <div className="flex items-end justify-between h-32 gap-2">
              {weekly.map((w, i) => {
                const h = Math.round((w.count / maxWeekly) * 100);
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <div className="text-[10px] font-bold text-slate-500">
                      {w.count > 0 ? w.count : ""}
                    </div>
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        w.isToday
                          ? "bg-primary shadow-[0_0_15px_rgba(127,19,236,0.4)]"
                          : "bg-primary/30 dark:bg-primary/40"
                      }`}
                      style={{ height: `${Math.max(4, h)}%` }}
                    ></div>
                    <span className="text-[10px] text-slate-500 uppercase">
                      {w.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-3 text-center uppercase tracking-wider">
              Cards reviewed + test questions answered
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} /> Topics to Review
          </h2>
          <div className="space-y-3">
            {weakDecks.length === 0 ? (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center text-sm text-slate-500">
                Nothing flagged yet — keep practising and weak decks will appear here.
              </div>
            ) : (
              weakDecks.map(({ deck, acc }) => {
                const a = acc ?? 0;
                const color =
                  a < 50 ? "border-l-red-500 bg-red-500/10 text-red-500" : "border-l-amber-500 bg-amber-500/10 text-amber-500";
                const [borderClass, bgClass, txtClass] = color.split(" ");
                return (
                  <div
                    key={deck.id}
                    className={`bg-primary/5 border border-primary/20 flex items-center gap-4 p-4 rounded-xl border-l-4 ${borderClass}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgClass} ${txtClass}`}
                    >
                      <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{deck.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Last accuracy: {a}%
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate("/flashcards", {
                          state: { selectedDeckId: deck.id },
                        })
                      }
                      className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Study
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {stats.mockResults.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FunctionSquare className="text-teal-500" size={20} /> Recent Mock Tests
            </h2>
            <div className="space-y-3">
              {stats.mockResults.slice(0, 5).map((r) => {
                const acc = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
                const date = new Date(r.takenAt);
                return (
                  <div
                    key={r.id}
                    className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3"
                  >
                    <div
                      className={`size-12 rounded-xl flex items-center justify-center font-black ${
                        acc >= 80
                          ? "bg-teal-500/15 text-teal-500"
                          : acc >= 50
                            ? "bg-amber-500/15 text-amber-500"
                            : "bg-red-500/15 text-red-500"
                      }`}
                    >
                      {acc}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{r.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {r.correct}/{r.total} correct · {date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="border border-primary/20 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-primary/10">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Bell size={20} className="text-primary" />
                  Activity History
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(!state.activityLog || state.activityLog.length === 0) ? (
                  <div className="text-center py-10 text-slate-500">
                    <Clock size={40} className="mx-auto mb-3 opacity-50" />
                    <p>No recent activity found.</p>
                  </div>
                ) : (
                  state.activityLog.map((activity) => {
                    const date = new Date(activity.timestamp);
                    return (
                      <div
                        key={activity.id}
                        className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex items-start gap-3"
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            activity.type === "added"
                              ? "bg-emerald-500/20 text-emerald-500"
                              : activity.type === "edited"
                                ? "bg-blue-500/20 text-blue-500"
                                : activity.type === "completed"
                                  ? "bg-purple-500/20 text-purple-500"
                                  : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {activity.itemType === "card" ? (
                            <BookOpen size={16} />
                          ) : (
                            <FunctionSquare size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-bold capitalize">
                              {activity.type}
                            </span>{" "}
                            {activity.itemType}:{" "}
                            <span className="font-medium text-primary">
                              {activity.itemName}
                            </span>
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {date.toLocaleDateString()} at{" "}
                            {date.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Stats;
