import React, { useState } from "react";
import { Search, FunctionSquare, Bookmark, ArrowLeft, X, Layers, Star, RefreshCw, XCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../context/AppContext";

const FormulaLibrary = () => {
  const [selectedClass, setSelectedClass] = useState("11");
  const [selectedSubject, setSelectedSubject] = useState("Physics");
  const [studyCard, setStudyCard] = useState<any>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const openFormula = (front: string, back: string, notes?: string) => {
    setStudyCard({
      id: Date.now().toString(),
      front,
      back,
      notes,
      type: 'formula',
      deckName: `${selectedSubject} - Class ${selectedClass}`
    });
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex flex-col pb-24">
      {/* ... existing header ... */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="px-4 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white">
                <FunctionSquare size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight">
                  Formula Library
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Revision Master by Kaif
                </p>
              </div>
            </div>
            <button className="size-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Search size={20} />
            </button>
          </div>

          <div className="flex border-b border-primary/10 gap-6 overflow-x-auto no-scrollbar">
            {["Physics", "Chemistry", "Biology", "Math"].map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`flex flex-col items-center justify-center border-b-2 pb-2 shrink-0 ${selectedSubject === subject ? "border-primary text-primary font-bold" : "border-transparent text-slate-500 dark:text-slate-400 font-medium"}`}
              >
                <p className="text-sm">{subject}</p>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-6">
        <div className="flex p-1 bg-primary/10 rounded-xl">
          <label className="flex-1 cursor-pointer">
            <input
              type="radio"
              name="class"
              className="hidden peer"
              checked={selectedClass === "11"}
              onChange={() => setSelectedClass("11")}
            />
            <div className="py-2 text-center rounded-lg peer-checked:bg-primary peer-checked:text-white text-slate-500 dark:text-slate-400 text-sm font-semibold transition-all">
              Class 11
            </div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input
              type="radio"
              name="class"
              className="hidden peer"
              checked={selectedClass === "12"}
              onChange={() => setSelectedClass("12")}
            />
            <div className="py-2 text-center rounded-lg peer-checked:bg-primary peer-checked:text-white text-slate-500 dark:text-slate-400 text-sm font-semibold transition-all">
              Class 12
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Units & Measurements</h2>
          <button className="text-primary text-sm font-medium">View All</button>
        </div>

        <div className="space-y-4">
          <div 
            onClick={() => openFormula("Equations of Motion", "v = u + at\ns = ut + ½at²\nv² = u² + 2as", "v: final velocity, u: initial velocity, a: acceleration, t: time, s: displacement")}
            className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col gap-4 cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                  Kinematics
                </span>
                <h3 className="text-base font-semibold mt-1">
                  Equations of Motion
                </h3>
              </div>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <Bookmark size={20} />
              </button>
            </div>
            <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4 border border-primary/5 flex flex-col items-center gap-4">
              <div className="text-lg font-serif italic tracking-wide text-primary">
                v = u + at
              </div>
              <div className="text-lg font-serif italic tracking-wide text-primary">
                s = ut + ½at²
              </div>
              <div className="text-lg font-serif italic tracking-wide text-primary">
                v² = u² + 2as
              </div>
            </div>
          </div>

          <div 
            onClick={() => openFormula("Universal Law of Gravitation", "F = G (m₁m₂) / r²", "Every particle attracts every other particle with a force proportional to the product of their masses.")}
            className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col gap-4 cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                  Gravitation
                </span>
                <h3 className="text-base font-semibold mt-1">
                  Universal Law of Gravitation
                </h3>
              </div>
              <button className="text-primary transition-colors">
                <Bookmark size={20} className="fill-current" />
              </button>
            </div>
            <div className="bg-white/50 dark:bg-white/5 rounded-lg p-6 border border-primary/5 flex flex-col items-center gap-6">
              <div className="w-full flex justify-center py-2">
                <svg
                  width="180"
                  height="80"
                  viewBox="0 0 180 80"
                  className="stroke-primary fill-none"
                >
                  <circle
                    cx="30"
                    cy="40"
                    r="15"
                    className="stroke-2 opacity-80"
                  ></circle>
                  <circle
                    cx="150"
                    cy="40"
                    r="22"
                    className="stroke-2 opacity-80"
                  ></circle>
                  <line
                    x1="30"
                    y1="40"
                    x2="150"
                    y2="40"
                    strokeDasharray="4"
                    className="opacity-30"
                  ></line>
                  <path
                    d="M50 40 L70 40"
                    markerEnd="url(#arrow)"
                    className="stroke-2"
                  ></path>
                  <path
                    d="M120 40 L100 40"
                    markerEnd="url(#arrow)"
                    className="stroke-2"
                  ></path>
                  <text
                    x="25"
                    y="35"
                    className="fill-slate-900 dark:fill-slate-100 text-[10px] italic stroke-none"
                  >
                    m1
                  </text>
                  <text
                    x="145"
                    y="35"
                    className="fill-slate-900 dark:fill-slate-100 text-[10px] italic stroke-none"
                  >
                    m2
                  </text>
                  <text
                    x="85"
                    y="55"
                    className="fill-slate-500 dark:fill-slate-400 text-[8px] stroke-none"
                  >
                    r
                  </text>
                </svg>
              </div>
              <div className="text-xl font-serif italic tracking-widest text-primary">
                F = G (m₁m₂) / r²
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Study Modal */}
      {studyCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background-light dark:bg-background-dark border border-primary/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[750px]">
            <div className="flex items-center justify-between p-4 border-b border-primary/10">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded flex items-center justify-center bg-teal-500/10 text-teal-500">
                  <FunctionSquare size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Formula Review</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{studyCard.deckName}</p>
                </div>
              </div>
              <button 
                onClick={() => setStudyCard(null)}
                className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center relative perspective-1000">
              <div 
                className={`w-full h-full transition-all duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''} shadow-2xl rounded-xl relative`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-inner">
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-6">Formula Name</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{studyCard.front}</h2>
                </div>
                
                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-inner overflow-y-auto">
                  <p className="text-sm text-primary font-bold uppercase tracking-widest mb-6">Equation</p>
                  <h2 className="text-xl md:text-2xl font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">{studyCard.back}</h2>
                  {studyCard.notes && (
                    <div className="mt-6 p-4 bg-white/60 dark:bg-black/40 rounded-xl text-sm italic text-slate-700 dark:text-slate-300 w-full border border-primary/10 shadow-sm">
                      {studyCard.notes}
                    </div>
                  )}
                </div>
              </div>
              
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
                className="flex-1 py-2 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 text-sm"
              >
                <XCircle size={16} /> Close
              </button>
              <button 
                onClick={() => setStudyCard(null)}
                className="flex-1 py-2 rounded-xl font-bold bg-emerald-500 text-white flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 size={16} /> Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <svg width="0" height="0">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              fill="#7f13ec"
              className="stroke-none"
            ></path>
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default FormulaLibrary;
