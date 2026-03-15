import React, { useState } from "react";
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
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";

const Stats = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const totalFlashcards = state.decks.filter(d => d.type === "flashcard").reduce((acc, deck) => acc + deck.cards.length, 0);
  const totalFormulas = state.decks.filter(d => d.type === "formula").reduce((acc, deck) => acc + deck.cards.length, 0);
  
  // Mock accuracy data since we don't track actual test scores yet
  const flashcardAccuracy = 82;
  const formulaAccuracy = 65;
  const overallAccuracy = Math.round((flashcardAccuracy + formulaAccuracy) / 2);
  const strokeDashoffset = 440 - (440 * overallAccuracy) / 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex flex-col pb-24"
    >
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-primary/5 border-b border-primary/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold tracking-tight">
            Learning Analytics
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNotifications(true)}
            className="p-2 rounded-lg bg-primary/10 text-primary relative"
          >
            <Bell size={20} />
            {state.activityLog?.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full"></span>
            )}
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
            <img
              src={state.user.avatar}
              alt="User Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
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
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{overallAccuracy}%</span>
                <span className="text-teal-500 text-sm font-semibold flex items-center">
                  <TrendingUp size={14} className="mr-1" /> +5%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="size-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Correct</p>
                  <p className="text-lg font-bold text-teal-500">842</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                  <XCircle size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Wrong</p>
                  <p className="text-lg font-bold text-red-500">114</p>
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
                <span className="font-medium flex items-center gap-2"><BookOpen size={14} className="text-blue-500"/> Flashcards</span>
                <span className="font-bold">{flashcardAccuracy}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${flashcardAccuracy}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium flex items-center gap-2"><FunctionSquare size={14} className="text-teal-500"/> Formulas</span>
                <span className="font-bold">{formulaAccuracy}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${formulaAccuracy}%` }}></div>
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
              <h3 className="text-sm font-semibold mb-4 text-slate-500 uppercase tracking-wider">Flashcards</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Physics (Strong)</span>
                    <span className="text-teal-500 font-bold">92%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" style={{ width: "92%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Organic Chem (Weak)</span>
                    <span className="text-red-500 font-bold">42%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: "42%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-primary/10">
              <h3 className="text-sm font-semibold mb-4 text-slate-500 uppercase tracking-wider">Formulas</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Math (Strong)</span>
                    <span className="text-teal-500 font-bold">95%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" style={{ width: "95%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Calculus (Weak)</span>
                    <span className="text-amber-500 font-bold">65%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: "65%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="text-blue-500" size={20} /> Weekly Activity
          </h2>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <div className="flex items-end justify-between h-32 gap-2">
              {[40, 65, 50, 90, 75, 35, 60].map((height, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <div
                    className={`w-full rounded-t-lg ${i === 3 ? "bg-primary shadow-[0_0_15px_rgba(127,19,236,0.4)]" : "bg-primary/30 dark:bg-primary/40"}`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-[10px] text-slate-500 uppercase">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="text-teal-500" size={20} /> Topics to
            Review
          </h2>
          <div className="space-y-3">
            <div className="bg-primary/5 border border-primary/20 flex items-center gap-4 p-4 rounded-xl border-l-4 border-l-red-500">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">Organic Reactions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last attempt: 42% accuracy
                </p>
              </div>
              <button 
                onClick={() => navigate('/flashcards')}
                className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Study
              </button>
            </div>
            <div className="bg-primary/5 border border-primary/20 flex items-center gap-4 p-4 rounded-xl border-l-4 border-l-amber-500">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">Calculus: Integrals</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Requires 3 more sessions
                </p>
              </div>
              <button 
                onClick={() => navigate('/flashcards')}
                className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Study
              </button>
            </div>
          </div>
        </section>
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
            className="bg-background-light dark:bg-background-dark border border-primary/20 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
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
                    <div key={activity.id} className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'added' ? 'bg-emerald-500/20 text-emerald-500' :
                        activity.type === 'edited' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {activity.itemType === 'card' ? <BookOpen size={16} /> : <FunctionSquare size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-bold capitalize">{activity.type}</span> {activity.itemType}: <span className="font-medium text-primary">{activity.itemName}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {date.toLocaleDateString()} at {date.toLocaleTimeString()}
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
