import React, { useState, useMemo, useRef, useEffect } from "react";
import { BookOpen, Settings, Play, Check, X, RefreshCw, ArrowLeft, CheckCircle, XCircle, Sparkles, FileText, Youtube, Loader2, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext, Card, Deck, MockTest, MockQuestion } from "../context/AppContext";
import { GoogleGenAI, Type } from "@google/genai";
import { generateJson, resolveProviderAndKey, AiError } from "../utils/ai";
import { useAiErrorModal } from "../components/AiErrorProvider";

type TestState = "setup" | "generate" | "testing" | "results" | "timer_setup";
type TimerMode = "none" | "default" | "custom";
type GenSource = "topic" | "pdf" | "youtube";

interface TestResult {
  question: MockQuestion;
  selectedOptionIndex: number | null; // null means skipped
  isCorrect: boolean;
}

const MockTests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, logActivity, addMockTest, deleteMockTest, recordMockTestResult } = useAppContext();
  const { showAiError } = useAiErrorModal();
  
  const [testState, setTestState] = useState<TestState>("setup");
  
  const [timerMode, setTimerMode] = useState<TimerMode>("none");
  const [timerDuration, setTimerDuration] = useState<number>(30); // in minutes
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (testState === "testing" && timerMode !== "none" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState, timerMode, timeLeft]);

  const handleFinishTest = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    setTimeTaken(duration);
    setTestState("results");
    if (currentTest) {
      const correct = results.filter((r) => r.isCorrect).length;
      const skipped = results.filter((r) => r.selectedOptionIndex === null).length;
      const wrong = results.length - correct - skipped;
      recordMockTestResult({
        testId: currentTest.id,
        title: currentTest.title,
        correct,
        wrong,
        skipped,
        total: currentTest.questions.length,
        durationSec: duration,
      });
      logActivity({
        type: "completed",
        itemType: "mock_test",
        itemName: `${currentTest.title} (Time Up)`,
      });
    }
  };
  
  useEffect(() => {
    let shouldClearState = false;
    
    if (location.state?.openAiModal) {
      setTestState("generate");
      shouldClearState = true;
    }

    if (shouldClearState) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const [selectedDeckId, setSelectedDeckId] = useState<string>(location.state?.selectedDeckId || "all");
  const [questionCount, setQuestionCount] = useState<number>(10);
  
  // Generation State
  const [genSource, setGenSource] = useState<GenSource>("topic");
  const [genNumCards, setGenNumCards] = useState<number | "custom">(10);
  const [genCustomNumCards, setGenCustomNumCards] = useState<number>(20);
  const [genTopic, setGenTopic] = useState("");
  const [genYoutubeUrl, setGenYoutubeUrl] = useState("");
  const [genPdfFile, setGenPdfFile] = useState<File | null>(null);
  const [genPdfBase64, setGenPdfBase64] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerationStage, setAiGenerationStage] = useState<"thinking" | "building" | "done">("thinking");
  const [aiGenerationMessage, setAiGenerationMessage] = useState("MKR Ai is preparing your mock test...");
  const [generatedAiTest, setGeneratedAiTest] = useState<MockTest | null>(null);
  const aiGenerationCancelledRef = useRef(false);
  const aiGenerationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Test execution state
  const [currentTest, setCurrentTest] = useState<MockTest | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);

  const rangeStyle = (value: number, min: number, max: number): React.CSSProperties => {
    const pct = ((value - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${pct}%, var(--bg-surface-3) ${pct}%, var(--bg-surface-3) 100%)`,
    };
  };

  const allCards = useMemo(() => {
    return state.decks.flatMap(d => d.cards);
  }, [state.decks]);

  const availableCardsCount = useMemo(() => {
    if (selectedDeckId === "all") return allCards.length;
    const deck = state.decks.find(d => d.id === selectedDeckId);
    return deck ? deck.cards.length : 0;
  }, [selectedDeckId, allCards, state.decks]);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setGenPdfFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setGenPdfBase64(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleGenerateAI = async () => {
    const actualNumCards = genNumCards === "custom" ? genCustomNumCards : genNumCards;
    const hasOwnKey = !!(
      state.user.apiKeys?.[state.user.aiProvider || "gemini"]?.trim() ||
      ((state.user.aiProvider || "gemini") === "gemini" && state.user.customApiKey?.trim())
    );
    const hardLimit = hasOwnKey ? Infinity : 200;
    if (actualNumCards < 1 || actualNumCards > hardLimit) {
      alert(hasOwnKey ? "Please enter at least 1 question." : "Please select between 1 and 200 questions. Add your own API key in Settings for unlimited generation.");
      return;
    }

    if (genSource === "topic" && !genTopic.trim()) return alert("Please enter a topic.");
    if (genSource === "youtube" && !genYoutubeUrl.trim()) return alert("Please enter a YouTube URL.");
    if (genSource === "pdf" && !genPdfBase64) return alert("Please upload a PDF file.");

    setIsGenerating(true);
    aiGenerationCancelledRef.current = false;
    setGeneratedAiTest(null);
    setAiGenerationStage("thinking");
    setAiGenerationMessage("MKR Ai is preparing your mock test...");
    if (aiGenerationTimerRef.current) clearInterval(aiGenerationTimerRef.current);
    aiGenerationTimerRef.current = setInterval(() => {
      setAiGenerationMessage((prev) => {
        if (aiGenerationCancelledRef.current) return prev;
        if (actualNumCards > 25) return "MKR Ai is organizing a large test set...";
        if (genSource === "pdf") return "MKR Ai is reading your PDF and extracting questions...";
        if (genSource === "youtube") return "MKR Ai is analyzing your video topic...";
        return "MKR Ai is drafting strong questions and answer choices...";
      });
    }, 900);
    
    try {
      const schema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            correctAnswerIndex: { type: "integer" },
            explanation: { type: "string" }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      };
      const system =
        "You are MKR Ai, an AI assistant for Revision Master. Generate high-quality multiple-choice questions with exactly 4 options each, and correctAnswerIndex between 0 and 3. Return ONLY a JSON array. Check the spellings and details are correct before responding.";

      let generatedQs: any[] = [];

      if (genSource === "pdf") {
        // PDF requires Gemini multimodal — route directly through Gemini.
        const { provider, apiKey } = resolveProviderAndKey(state.user);
        if (provider !== "gemini" || !apiKey) {
          throw Object.assign(
            new Error(
              "PDF questions need a Gemini API key. Add one in Settings → AI (set provider to Gemini)."
            ),
            { code: "missing_key", userMessage: "PDF questions need a Gemini API key. Add one in Settings → AI (set provider to Gemini)." }
          );
        }
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: {
            parts: [
              { text: `Generate a multiple-choice mock test with exactly ${actualNumCards} questions from the attached PDF.` },
              { inlineData: { mimeType: "application/pdf", data: genPdfBase64 } }
            ]
          } as any,
          config: {
            systemInstruction: system,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctAnswerIndex", "explanation"]
              }
            }
          }
        });
        let jsonStr = (response.text || "").trim().replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
        generatedQs = JSON.parse(jsonStr);
      } else {
        setAiGenerationStage("thinking");
        setAiGenerationMessage(actualNumCards > 25 ? "MKR Ai is organizing a larger test set..." : "MKR Ai is drafting your questions...");
        const prompt =
          genSource === "topic"
            ? `Generate exactly ${actualNumCards} multiple-choice questions about: ${genTopic}.`
            : `Generate exactly ${actualNumCards} multiple-choice questions based on this YouTube video (use the title/topic in the URL): ${genYoutubeUrl}`;
        generatedQs = await generateJson<any[]>(state.user, prompt, schema, { system });
      }

      if (aiGenerationCancelledRef.current) return;
      setAiGenerationStage("building");
      setAiGenerationMessage("Building your test...");

      if (Array.isArray(generatedQs) && generatedQs.length > 0) {
        const newQuestions: MockQuestion[] = generatedQs.map((q: any) => ({
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          question: q.question,
          options: q.options.slice(0, 4), // Ensure exactly 4
          correctAnswerIndex: Math.min(3, Math.max(0, q.correctAnswerIndex)),
          explanation: q.explanation || ""
        }));

        const testTitle = genSource === "topic" ? genTopic : genSource === "youtube" ? "YouTube Video Test" : "PDF Document Test";
        const newTest: MockTest = {
          id: Date.now().toString(),
          title: `${testTitle.substring(0, 30)}${testTitle.length > 30 ? '...' : ''} (AI)`,
          questions: newQuestions,
          createdAt: new Date().toISOString()
        };

        addMockTest(newTest);
        logActivity({
          type: "added",
          itemType: "mock_test",
          itemName: newTest.title,
        });
        setGeneratedAiTest(newTest);
        setAiGenerationStage("done");
        setAiGenerationMessage("Your mock test is ready.");
        
        // Go to timer setup
        setCurrentTest(newTest);
        setTestState("timer_setup");
      }
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      showAiError(error, "generating a mock test");
    } finally {
      if (aiGenerationTimerRef.current) clearInterval(aiGenerationTimerRef.current);
      setIsGenerating(false);
    }
  };

  const cancelAiGeneration = () => {
    aiGenerationCancelledRef.current = true;
    if (aiGenerationTimerRef.current) clearInterval(aiGenerationTimerRef.current);
    setIsGenerating(false);
    setAiGenerationStage("thinking");
    setAiGenerationMessage("Generation cancelled.");
  };

  const startOfflineTest = () => {
    let pool = allCards;
    if (selectedDeckId !== "all") {
      const deck = state.decks.find(d => d.id === selectedDeckId);
      if (deck) pool = deck.cards;
    }

    if (pool.length === 0) {
      alert("No cards available in the selected deck.");
      return;
    }

    // Shuffle and pick
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, pool.length));
    
    // Convert flashcards to MockQuestions by generating fake options
    const questions: MockQuestion[] = selected.map(card => {
      // Get 3 random incorrect answers from other cards
      const otherCards = pool.filter(c => c.id !== card.id);
      const shuffledOthers = [...otherCards].sort(() => 0.5 - Math.random());
      const wrongAnswers = shuffledOthers.slice(0, 3).map(c => c.back);
      
      // If we don't have enough other cards, generate dummy options
      while (wrongAnswers.length < 3) {
        wrongAnswers.push(`Option ${wrongAnswers.length + 1}`);
      }
      
      const options = [...wrongAnswers, card.back].sort(() => 0.5 - Math.random());
      const correctIndex = options.indexOf(card.back);
      
      return {
        id: card.id,
        question: card.front,
        options: options,
        correctAnswerIndex: correctIndex,
        explanation: card.notes || "No explanation provided."
      };
    });

    const newTest: MockTest = {
      id: "offline-" + Date.now().toString(),
      title: `Offline Test (${questions.length} Qs)`,
      questions: questions,
      createdAt: new Date().toISOString()
    };

    setCurrentTest(newTest);
    setTestState("timer_setup");
  };

  const startActualTest = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setResults([]);
    setStartTime(Date.now());
    
    if (timerMode === "default") {
      setTimeLeft(30 * 60);
    } else if (timerMode === "custom") {
      setTimeLeft(timerDuration * 60);
    } else {
      setTimeLeft(0);
    }
    
    setTestState("testing");
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return; // Must select an option to submit
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (!currentTest) return;
    
    const currentQ = currentTest.questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswerIndex;
    
    const newResults = [...results, { 
      question: currentQ, 
      selectedOptionIndex: selectedOption,
      isCorrect: isSubmitted ? isCorrect : false // If skipped, it's incorrect
    }];
    
    setResults(newResults);
    
    if (currentIndex < currentTest.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Finish test
      const duration = Math.floor((Date.now() - startTime) / 1000);
      setTimeTaken(duration);
      setTestState("results");
      const correct = newResults.filter((r) => r.isCorrect).length;
      const skipped = newResults.filter((r) => r.selectedOptionIndex === null).length;
      const wrong = newResults.length - correct - skipped;
      recordMockTestResult({
        testId: currentTest.id,
        title: currentTest.title,
        correct,
        wrong,
        skipped,
        total: currentTest.questions.length,
        durationSec: duration,
      });
      logActivity({
        type: "completed",
        itemType: "mock_test",
        itemName: `${currentTest.title} (${correct}/${newResults.length})`,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  if (testState === "generate") {
    return (
      <div className="min-h-screen font-display text-primary-fg flex flex-col pb-24">
        <header className="sticky top-0 z-50 px-4 pb-3" style={{ paddingTop: `calc(env(safe-area-inset-top) + 8px)` }}>
          <div className="flex items-center justify-between gap-3 backdrop-blur-xl bg-elevated/70 border border-white/[0.08] shadow-lg shadow-black/10 rounded-2xl px-4 py-2.5">
            <button onClick={() => setTestState("setup")} className="size-11 rounded-2xl hover:bg-primary/10 transition-colors flex items-center justify-center">
              <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg flex-1 text-center">Generate with MKR Ai</h1>
            <div className="size-11" />
          </div>
        </header>

        <main className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-6">
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="fixed inset-0 z-[70] bg-slate-950/20 backdrop-blur-md flex items-start sm:items-center justify-center p-4"
                style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
              >
                <div className="w-full max-w-md rounded-3xl bg-white/70 dark:bg-slate-900/65 border border-white/30 dark:border-white/10 shadow-2xl shadow-blue-500/10 backdrop-blur-xl p-6 text-center space-y-5">
                  <div className="mx-auto size-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Loader2 size={30} className="animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-blue-500 dark:text-blue-300 font-bold">AI Generation</p>
                    <h3 className="text-xl font-bold text-blue-700 dark:text-blue-200">
                      {aiGenerationStage === "thinking" ? "Thinking" : aiGenerationStage === "building" ? "Building" : "Done"}
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{aiGenerationMessage}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={cancelAiGeneration} className="flex-1 rounded-xl border border-blue-200/70 dark:border-blue-400/20 bg-white/50 dark:bg-white/5 py-3 font-bold text-sm text-blue-700 dark:text-blue-200">
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
            <div className="bg-purple-500/10 border border-purple-500/25 rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
              MKR Ai will analyze your input and generate a complete multiple-choice mock test.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Number of Questions</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {[5, 10, 15, 50].map((num) => (
                <button
                  key={num}
                  onClick={() => setGenNumCards(num)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    genNumCards === num
                      ? "bg-purple-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setGenNumCards("custom")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  genNumCards === "custom"
                    ? "bg-purple-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Custom
              </button>
            </div>
            {genNumCards === "custom" && (
              <div className="mb-4">
                <input
                  type="number"
                  min="1"
                  value={genCustomNumCards}
                  onChange={(e) => setGenCustomNumCards(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-elevated border border-subtle rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none"
                  placeholder="Enter number of questions"
                />
                {!(state.user.apiKeys?.[state.user.aiProvider || "gemini"]?.trim() || ((state.user.aiProvider || "gemini") === "gemini" && state.user.customApiKey?.trim())) && (
                  <p className="text-[10px] text-amber-500 dark:text-amber-400 mt-1">Max 200 with app key. Add your own API key for unlimited.</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Source Material</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setGenSource("topic")}
                className={`p-3 rounded-xl flex flex-col items-center gap-2 border-2 transition-colors ${genSource === "topic" ? "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400" : "border-subtle bg-surface-2 text-secondary-fg hover:bg-surface-3"}`}
              >
                <FileText size={24} />
                <span className="text-xs font-bold">Topic</span>
              </button>
              <button
                onClick={() => setGenSource("pdf")}
                className={`p-3 rounded-xl flex flex-col items-center gap-2 border-2 transition-colors ${genSource === "pdf" ? "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400" : "border-subtle bg-surface-2 text-secondary-fg hover:bg-surface-3"}`}
              >
                <BookOpen size={24} />
                <span className="text-xs font-bold">PDF</span>
              </button>
              <button
                onClick={() => setGenSource("youtube")}
                className={`p-3 rounded-xl flex flex-col items-center gap-2 border-2 transition-colors ${genSource === "youtube" ? "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400" : "border-subtle bg-surface-2 text-secondary-fg hover:bg-surface-3"}`}
              >
                <Youtube size={24} />
                <span className="text-xs font-bold">YouTube</span>
              </button>
            </div>

            {genSource === "topic" && (
              <textarea 
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                placeholder="e.g. History of the Roman Empire, or React Hooks"
                className="w-full bg-elevated border border-subtle rounded-lg p-4 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none min-h-[120px] resize-none"
              />
            )}

            {genSource === "pdf" && (
              <div className="border-2 border-dashed border-subtle rounded-xl p-8 text-center bg-surface-2">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handlePdfUpload}
                  className="hidden" 
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-400">Click to upload PDF</p>
                    <p className="text-xs text-slate-500 mt-1">{genPdfFile ? genPdfFile.name : "Max file size: 10MB"}</p>
                  </div>
                </label>
              </div>
            )}

            {genSource === "youtube" && (
              <input 
                type="text"
                value={genYoutubeUrl}
                onChange={(e) => setGenYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube Video URL here..."
                className="w-full bg-elevated border border-subtle rounded-lg p-4 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none"
              />
            )}
          </div>

          <button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-transform active:scale-95"
          >
            {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            {isGenerating ? "Generating Test..." : "Generate Mock Test"}
          </button>
          <p className="text-[10px] text-slate-500 text-center mt-3 italic">
            Note: MKR Ai can occasionally make mistakes. Please verify the generated content.
            {genSource !== "topic" && " Content extracted from PDFs or YouTube videos may not always be perfectly accurate."}
          </p>
          {generatedAiTest && (
            <button onClick={() => setCurrentTest(generatedAiTest)} className="w-full mt-2 text-sm font-bold text-purple-600 dark:text-purple-400">
              Open generated test again
            </button>
          )}
        </main>
      </div>
    );
  }

  if (testState === "timer_setup" && currentTest) {
    return (
      <div className="min-h-screen font-display text-primary-fg flex flex-col pb-24">
        <header className="sticky top-0 z-50 px-4 pb-3" style={{ paddingTop: `calc(env(safe-area-inset-top) + 8px)` }}>
          <div className="flex items-center justify-between gap-3 backdrop-blur-xl bg-elevated/70 border border-white/[0.08] shadow-lg shadow-black/10 rounded-2xl px-4 py-2.5">
            <button onClick={() => setTestState("setup")} className="size-11 rounded-2xl hover:bg-primary/10 transition-colors flex items-center justify-center">
              <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg flex-1 text-center">Test Configuration</h1>
            <div className="size-11" />
          </div>
        </header>

        <main className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-8 py-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{currentTest.title}</h2>
            <p className="text-slate-500">{currentTest.questions.length} Questions</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg px-2">Choose Timer Mode</h3>
            
            <div className="grid gap-3">
              <button 
                onClick={() => setTimerMode("none")}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${timerMode === "none" ? "border-primary bg-primary/5" : "border-subtle bg-elevated hover:border-primary/30"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">No Timer</p>
                    <p className="text-sm text-slate-500">Take your time, no pressure.</p>
                  </div>
                  {timerMode === "none" && <CheckCircle className="text-primary" size={24} />}
                </div>
              </button>

              <button 
                onClick={() => setTimerMode("default")}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${timerMode === "default" ? "border-primary bg-primary/5" : "border-subtle bg-elevated hover:border-primary/30"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Standard Timer (30 min)</p>
                    <p className="text-sm text-slate-500">Recommended for this test length.</p>
                  </div>
                  {timerMode === "default" && <CheckCircle className="text-primary" size={24} />}
                </div>
              </button>

              <div className={`p-5 rounded-2xl border-2 text-left transition-all ${timerMode === "custom" ? "border-primary bg-primary/5" : "border-subtle bg-elevated hover:border-primary/30"}`}>
                <button 
                  onClick={() => setTimerMode("custom")}
                  className="w-full text-left mb-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Custom Timer</p>
                      <p className="text-sm text-slate-500">Set your own time limit.</p>
                    </div>
                    {timerMode === "custom" && <CheckCircle className="text-primary" size={24} />}
                  </div>
                </button>
                
                {timerMode === "custom" && (
                  <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                    <input
                      type="range"
                      min="1"
                      max="180"
                      value={timerDuration}
                      onChange={(e) => setTimerDuration(Number(e.target.value))}
                      className="flex-1 cursor-pointer appearance-none h-2 rounded-full"
                      style={rangeStyle(timerDuration, 1, 180)}
                    />
                    <span className="font-bold text-lg w-16 text-center">{timerDuration}m</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={startActualTest}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-transform active:scale-95 mt-8"
          >
            <Play size={20} className="fill-current" />
            START TEST NOW
          </button>
        </main>
      </div>
    );
  }

  if (testState === "testing" && currentTest) {
    const currentQ = currentTest.questions[currentIndex];
    
    const formatTimeLeft = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
      <div className="min-h-screen font-display text-primary-fg flex flex-col">
        <header className="sticky top-0 z-50 px-4 pb-3" style={{ paddingTop: `calc(env(safe-area-inset-top) + 8px)` }}>
          <div className="flex items-center justify-between gap-3 backdrop-blur-xl bg-elevated/70 border border-white/[0.08] shadow-lg shadow-black/10 rounded-2xl px-4 py-2.5">
            <button onClick={() => setTestState("setup")} className="size-11 rounded-2xl hover:bg-primary/10 transition-colors flex items-center justify-center">
              <X size={24} />
            </button>
            <div className="flex flex-col items-center flex-1">
              <div className="font-bold text-sm">Question {currentIndex + 1} of {currentTest.questions.length}</div>
              {timerMode !== "none" && (
                <div className={`text-xs font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                  {formatTimeLeft(timeLeft)}
                </div>
              )}
            </div>
            <div className="size-11" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 flex flex-col max-w-3xl mx-auto w-full">
            <div className="w-full bg-surface-1 border border-subtle rounded-2xl p-6 md:p-8 shadow-sm flex flex-col mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed">{currentQ.question}</h2>
            
            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, idx) => {
                let optionClass = "border-subtle hover:border-primary/50 bg-elevated";
                
                if (isSubmitted) {
                  if (idx === currentQ.correctAnswerIndex) {
                    optionClass = "border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300";
                  } else if (idx === selectedOption) {
                    optionClass = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300";
                  } else {
                    optionClass = "border-slate-200 dark:border-slate-700 opacity-50";
                  }
                } else if (selectedOption === idx) {
                  optionClass = "border-primary bg-primary/5 ring-2 ring-primary/20";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !isSubmitted && setSelectedOption(idx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${optionClass} flex items-center justify-between`}
                  >
                    <span className="font-medium">{option}</span>
                    {isSubmitted && idx === currentQ.correctAnswerIndex && <CheckCircle className="text-teal-500" size={20} />}
                    {isSubmitted && idx === selectedOption && idx !== currentQ.correctAnswerIndex && <XCircle className="text-red-500" size={20} />}
                  </button>
                );
              })}
            </div>

            {isSubmitted && currentQ.explanation && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Explanation</p>
                <p className="text-sm text-blue-900 dark:text-blue-100">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          <div className="mt-auto flex gap-4 pb-4">
            {!isSubmitted ? (
              <>
                <button 
                  onClick={handleNextQuestion}
                className="flex-1 py-4 rounded-xl font-bold bg-surface-2 text-secondary-fg border border-subtle transition-colors"
                >
                  Skip
                </button>
                <button 
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="flex-[2] py-4 rounded-xl font-bold bg-primary text-white disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
                >
                  Submit Answer
                </button>
              </>
            ) : (
              <button 
                onClick={handleNextQuestion}
                className="w-full py-4 rounded-xl font-bold bg-primary text-white transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {currentIndex < currentTest.questions.length - 1 ? "Next Question" : "Finish Test"} <ArrowLeft className="rotate-180" size={20} />
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (testState === "results" && currentTest) {
    const correctCount = results.filter(r => r.isCorrect).length;
    const skippedCount = results.filter(r => r.selectedOptionIndex === null).length;
    const incorrectCount = results.length - correctCount - skippedCount;
    const accuracy = Math.round((correctCount / results.length) * 100) || 0;
    
    // Calculate speed: questions per minute
    const minutes = timeTaken / 60;
    const speed = minutes > 0 ? Math.round((results.length / minutes) * 10) / 10 : results.length;
    
    // Speed rating (0-100) - assume 10 q/min is 100%
    const speedRating = Math.min(100, Math.round((speed / 10) * 100));

    return (
      <div className="min-h-screen font-display text-primary-fg flex flex-col pb-24">
        <header className="sticky top-0 z-50 px-4 pb-3" style={{ paddingTop: `calc(env(safe-area-inset-top) + 8px)` }}>
          <div className="flex items-center justify-between gap-3 backdrop-blur-xl bg-elevated/70 border border-white/[0.08] shadow-lg shadow-black/10 rounded-2xl px-4 py-2.5">
            <button onClick={() => setTestState("setup")} className="size-11 rounded-2xl hover:bg-primary/10 transition-colors flex items-center justify-center">
              <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg flex-1 text-center">Test Analytics</h1>
            <div className="size-11" />
          </div>
        </header>

        <main className="flex-1 p-4 max-w-3xl mx-auto w-full">
          <div className="bg-surface-1 border border-subtle rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="relative size-32 flex items-center justify-center">
                <svg className="size-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-surface-2"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * accuracy) / 100}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{accuracy}%</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-bold text-secondary-fg">Accuracy Progress</p>
                    <p className="text-lg font-bold text-primary">{accuracy}%</p>
                  </div>
                  <div className="h-3 w-full bg-surface-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${accuracy}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-bold text-secondary-fg">Speed (Qs/min)</p>
                    <p className="text-lg font-bold text-blue-500">{speed}</p>
                  </div>
                  <div className="h-3 w-full bg-surface-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000" 
                      style={{ width: `${speedRating}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-subtle">
              <div className="bg-surface-2 rounded-xl p-4 border border-subtle">
                <p className="text-xs text-tertiary-fg uppercase tracking-wider mb-1">Total Time</p>
                <p className="text-lg font-bold">{formatTime(timeTaken)}</p>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/10 rounded-xl p-4 border border-teal-100 dark:border-teal-900/30">
                <p className="text-xs text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">Correct</p>
                <p className="text-lg font-bold text-teal-700 dark:text-teal-300">{correctCount}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-100 dark:border-red-900/30">
                <p className="text-xs text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Incorrect</p>
                <p className="text-lg font-bold text-red-700 dark:text-red-300">{incorrectCount}</p>
              </div>
              <div className="bg-surface-2 rounded-xl p-4 border border-subtle">
                <p className="text-xs text-tertiary-fg uppercase tracking-wider mb-1">Skipped</p>
                <p className="text-lg font-bold">{skippedCount}</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-4 px-2">Detailed Review</h3>
          <div className="space-y-4">
            {results.map((result, idx) => (
              <div key={idx} className={`border rounded-xl p-5 bg-surface-1 shadow-sm ${result.isCorrect ? 'border-teal-500/30' : result.selectedOptionIndex === null ? 'border-subtle' : 'border-red-500/30'}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {result.isCorrect ? <CheckCircle className="text-teal-500" size={20} /> : result.selectedOptionIndex === null ? <div className="size-5 rounded-full border-2 border-slate-300 dark:border-slate-600" /> : <XCircle className="text-red-500" size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-primary-fg mb-3">{result.question.question}</p>
                    
                    <div className="space-y-2 mb-4">
                      {result.question.options.map((opt, oIdx) => {
                        let badge = null;
                        let optClass = "text-slate-700 dark:text-slate-400";
                        if (oIdx === result.question.correctAnswerIndex) {
                          badge = <span className="text-[10px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded ml-2">CORRECT</span>;
                          optClass = "text-teal-700 dark:text-teal-400 font-medium";
                        } else if (oIdx === result.selectedOptionIndex) {
                          badge = <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded ml-2">YOUR ANSWER</span>;
                          optClass = "text-red-700 dark:text-red-400 font-medium";
                        }
                        return (
                          <div key={oIdx} className={`text-sm flex items-center ${optClass}`}>
                            <span className="w-4">{oIdx === result.selectedOptionIndex ? "•" : ""}</span>
                            {opt} {badge}
                          </div>
                        );
                      })}
                    </div>

                    {result.question.explanation && (
                      <div className="bg-surface-2 rounded-lg p-3 border border-subtle">
                        <p className="text-xs font-bold text-tertiary-fg uppercase mb-1">Explanation</p>
                        <p className="text-sm text-secondary-fg">{result.question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setTestState("setup")}
            className="w-full mt-8 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Back to Mock Tests
          </button>
        </main>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="min-h-screen font-display text-primary-fg flex flex-col pb-24"
    >
      <header className="sticky top-0 z-50 px-4 pb-3" style={{ paddingTop: `calc(env(safe-area-inset-top) + 8px)` }}>
        <div className="flex items-center justify-between gap-3 backdrop-blur-xl bg-elevated/70 border border-white/[0.08] shadow-lg shadow-black/10 rounded-2xl px-4 py-2.5">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="size-10 rounded-lg bg-gradient-to-br from-primary via-blue-500 to-teal-500 flex items-center justify-center shadow-lg shadow-primary/20">
              <BookOpen className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none text-primary-fg">Mock Tests</h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="size-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 max-w-2xl mx-auto w-full py-6">
        
        {/* AI Generation Banner */}
        {state.user.aiEnabled !== false && (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => setTestState("generate")}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 shadow-lg shadow-purple-500/20 text-white cursor-pointer hover:scale-[1.02] transition-transform mb-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <Sparkles size={64} />
            </div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Sparkles size={24} /> Generate with MKR Ai
            </h2>
            <p className="text-purple-100 text-sm max-w-[80%]">
              Create custom mock tests instantly from topics, PDFs, or YouTube videos.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg font-bold text-sm backdrop-blur-sm">
              Try it now <ArrowLeft className="rotate-180" size={16} />
            </div>
          </motion.div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-surface-2"></div>
          <span className="text-xs font-bold text-tertiary-fg uppercase tracking-widest">OR</span>
          <div className="h-px flex-1 bg-surface-2"></div>
        </div>

        <div className="bg-elevated/95 backdrop-blur-md border border-subtle rounded-2xl p-6 shadow-sm space-y-6">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-primary-fg">
              Offline Mock Test
            </h2>
            <p className="text-sm text-secondary-fg mt-1">Test your knowledge using your existing flashcards.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-secondary-fg mb-2">Select Deck</label>
            <select 
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
              className="w-full bg-surface-2 border border-subtle rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50 text-primary-fg"
            >
              <option value="all">All Cards ({allCards.length})</option>
              {state.decks.map(deck => (
                <option key={deck.id} value={deck.id}>{deck.name} ({deck.cards.length})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-secondary-fg mb-2">Number of Questions</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="5" 
                max={Math.max(5, availableCardsCount)} 
                value={Math.min(questionCount, availableCardsCount)}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="flex-1 cursor-pointer appearance-none h-2 rounded-full"
                style={rangeStyle(Math.min(questionCount, availableCardsCount), 5, Math.max(5, availableCardsCount))}
                disabled={availableCardsCount === 0}
              />
              <span className="font-bold text-lg w-12 text-center">{Math.min(questionCount, availableCardsCount)}</span>
            </div>
            <p className="text-xs text-tertiary-fg mt-2">Available cards: {availableCardsCount}</p>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={startOfflineTest}
            disabled={availableCardsCount === 0}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-transform active:scale-95 mt-4 disabled:opacity-40"
          >
            <Play size={20} className="fill-current" />
            START OFFLINE TEST
          </motion.button>
        </div>
        
        {state.mockTests && state.mockTests.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-lg mb-4">Saved Mock Tests</h3>
            <div className="space-y-3">
              {state.mockTests.map(test => (
                <div key={test.id} className="bg-elevated/95 backdrop-blur-md border border-subtle rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-primary-fg">{test.title}</h4>
                    <p className="text-xs text-tertiary-fg mt-1">{test.questions.length} Questions • Generated {new Date(test.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setCurrentTest(test);
                        setCurrentIndex(0);
                        setSelectedOption(null);
                        setIsSubmitted(false);
                        setResults([]);
                        setStartTime(Date.now());
                        setTestState("testing");
                      }}
                      className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                    >
                      <Play size={16} className="fill-current" />
                    </button>
                    <button 
                      onClick={() => deleteMockTest(test.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
};

export default MockTests;

