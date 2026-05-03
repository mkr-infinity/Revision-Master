import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Theme =
  | "light-cream"
  | "light-paper"
  | "light-sand"
  | "dark-plum"
  | "dark-graphite"
  | "dark-forest"
  | "dark-void"
  | "light"
  | "dark";

export const THEMES: {
  id: Theme;
  name: string;
  mode: "light" | "dark";
  swatch: string;
  accent: string;
  surface: string;
}[] = [
  { id: "light-cream",    name: "Demon Slayer",     mode: "light", swatch: "#fff1f6", accent: "#ff3a5e", surface: "#ffffff" },
  { id: "light-paper",    name: "My Hero Academia", mode: "light", swatch: "#eef4ff", accent: "#1f6dff", surface: "#ffffff" },
  { id: "light-sand",     name: "Naruto",           mode: "light", swatch: "#ffe8d2", accent: "#ff7a1a", surface: "#fff4e6" },
  { id: "dark-plum",      name: "Jujutsu Kaisen",   mode: "dark",  swatch: "#140a22", accent: "#a855f7", surface: "#1f1338" },
  { id: "dark-graphite",  name: "Bleach",           mode: "dark",  swatch: "#0a1126", accent: "#4080ff", surface: "#111a36" },
  { id: "dark-forest",    name: "Vinland Saga",     mode: "dark",  swatch: "#091815", accent: "#5fe3c7", surface: "#0f231e" },
  { id: "dark-void",      name: "Solo Leveling",    mode: "dark",  swatch: "#030310", accent: "#4a9eff", surface: "#0c0c1e" },
];

export const normalizeTheme = (t?: Theme): Theme => {
  if (!t) return "light-cream";
  if (t === "light") return "light-cream";
  if (t === "dark") return "dark-plum";
  return t;
};

const getLevelFromXp = (xp: number) => Math.max(1, Math.floor(xp / 100) + 1);

export interface RecycleBinItem {
  id: string;
  type: "deck" | "card" | "mock_test";
  item: Deck | Card | MockTest;
  deletedAt: string;
  deckId?: string;
  deckName?: string;
}

export interface User {
  name: string;
  age: string;
  examTarget: string;
  examDate?: string;
  customQuote?: string;
  avatar: string;
  appLogo?: string;
  theme: Theme;
  onboardingCompleted: boolean;
  xp: number;
  level: number;
  aiEnabled?: boolean;
  customApiKey?: string;
  aiProvider?: "gemini" | "openai" | "grok" | "anthropic";
  apiKeys?: {
    gemini?: string;
    openai?: string;
    grok?: string;
    anthropic?: string;
  };
  autoUpdateEnabled?: boolean;
  lastUpdateSnoozedAt?: string | null;
  showSplashScreen?: boolean;
  navBarHeight?: number;
  navBarIconSize?: number;
  navBarHideLabels?: boolean;
  animationsEnabled?: boolean;
  decksLayout?: "grid" | "list";
  decksSize?: number;
  navOrientation?: "horizontal" | "vertical";
  navStyle?: "floating-pill" | "attached" | "glow" | "segments" | "minimal" | "compact" | "floating-glass";
  useSystemFont?: boolean;
  auraEnabled?: boolean;
  supportPromptShownStreak?: number | null;
  supportPromptShownAt?: string | null;
  supportPromptShownAfterExports?: number | null;
  pdfExportCount?: number;
  chatbotPosition?: { x: number; y: number } | null;
  customBgImage?: string;
  disableBgImage?: boolean;
  customBgOpacity?: number;
  recycleBinEnabled?: boolean;
  recycleBinRetentionDays?: number;
}

export interface Streak {
  current: number;
  max: number;
  lastActiveDate: string | null;
}

export interface Card {
  id: string;
  front: string;
  back: string;
  theme?: string;
  image?: string;
  showImageOnFront?: boolean;
  notes?: string;
  difficulty?: "easy" | "medium" | "hard";
  isFavourite?: boolean;
  isPinned?: boolean;
}

export interface Deck {
  id: string;
  name: string;
  type: "flashcard" | "formula";
  theme?: string;
  gradient?: string;
  cards: Card[];
  isPinned?: boolean;
  coverImage?: string; // AI-generated or user-uploaded cover image
}

export interface MockQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface MockTest {
  id: string;
  title: string;
  questions: MockQuestion[];
  createdAt: string;
}

export interface Activity {
  id: string;
  type: "added" | "edited" | "removed" | "completed";
  itemType: "card" | "deck" | "mock_test";
  itemName: string;
  timestamp: string;
}

export interface MockTestResult {
  id: string;
  testId: string;
  title: string;
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  durationSec: number;
  takenAt: string;
}

export interface TestStats {
  cardCorrect: number;
  cardWrong: number;
  byDeck: Record<string, { correct: number; wrong: number }>;
  daily: Record<string, number>; // YYYY-MM-DD -> total card+test events
  mockResults: MockTestResult[];
  lastUpdated: string | null;
}

export interface AppState {
  user: User;
  streak: Streak;
  decks: Deck[];
  mockTests: MockTest[];
  activityLog: Activity[];
  testStats: TestStats;
  recycleBin: RecycleBinItem[];
}

interface AppContextType {
  state: AppState;
  updateUser: (updates: Partial<User>) => void;
  updateStreak: () => void;
  resetOnboarding: () => void;
  resetStats: () => void;
  clearHistory: () => void;
  resetCards: () => void;
  addDeck: (deck: Deck) => void;
  updateDeck: (id: string, updates: Partial<Deck>) => void;
  deleteDeck: (id: string) => void;
  deleteCard: (deckId: string, cardId: string) => void;
  addMockTest: (test: MockTest) => void;
  deleteMockTest: (id: string) => void;
  importData: (data: any) => boolean;
  logActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
  recordCardResult: (deckId: string, mastered: boolean) => void;
  recordMockTestResult: (result: Omit<MockTestResult, "id" | "takenAt">) => void;
  recordPdfExport: () => void;
  restoreFromBin: (binItemId: string) => void;
  permanentlyDeleteFromBin: (binItemId: string) => void;
  emptyRecycleBin: () => void;
}

import appLogo from '../assets/logo.svg';
import botAvatar from '../assets/bot-avatar.svg';

export const BOT_AVATAR = botAvatar;
export const APP_LOGO = appLogo;

// Empty by design — we only ship a friendly Bot default + custom upload.
const AVATARS_DATA: { id: string; src: string; name: string }[] = [];

const isLegacyAvatar = (src?: string) =>
  !!src && /images\.unsplash\.com|avatar-[mfMF]\d|\/avatar[1-6]\.svg/.test(src);

const safeStorage = {
  getItem(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
};

// Single official app logo. Kept as an array so any older selector UI keeps working.
export const APP_LOGOS = [
  { id: 'logo', src: appLogo, name: 'Revision Master' },
];

export const AVATARS = AVATARS_DATA;

const defaultState: AppState = {
  user: {
    name: "",
    age: "",
    examTarget: "",
    avatar: botAvatar,
    appLogo: appLogo,
    theme: "light-cream",
    onboardingCompleted: false,
    xp: 0,
    level: 1,
    aiEnabled: true,
    aiProvider: "gemini",
    apiKeys: {},
    autoUpdateEnabled: true,
    lastUpdateSnoozedAt: null,
    showSplashScreen: true,
    navBarHeight: 56,
    navBarIconSize: 24,
    navBarHideLabels: false,
    animationsEnabled: true,
    decksLayout: "grid",
    decksSize: 1,
    navOrientation: "horizontal",
    navStyle: "floating-pill",
    auraEnabled: true,
    useSystemFont: false,
    supportPromptShownStreak: null,
    supportPromptShownAt: null,
    supportPromptShownAfterExports: null,
    pdfExportCount: 0,
    recycleBinEnabled: true,
    recycleBinRetentionDays: 15,
  },
  streak: {
    current: 0,
    max: 0,
    lastActiveDate: null,
  },
  activityLog: [],
  testStats: {
    cardCorrect: 0,
    cardWrong: 0,
    byDeck: {},
    daily: {},
    mockResults: [],
    lastUpdated: null,
  },
  mockTests: [],
  recycleBin: [],
  decks: [
    {
      id: "default-flashcards-1",
      name: "Basic Physics",
      type: "flashcard",
      gradient: "from-blue-500 to-indigo-600",
      cards: [
        { id: "fc1", front: "What is Newton's First Law?", back: "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.", theme: "blue" },
        { id: "fc2", front: "What is the speed of light?", back: "Approximately 299,792,458 meters per second (m/s).", theme: "yellow" }
      ]
    },
    {
      id: "default-flashcards-2",
      name: "Biology 101",
      type: "flashcard",
      gradient: "from-emerald-400 to-teal-600",
      cards: [
        { id: "fc3", front: "What is the powerhouse of the cell?", back: "Mitochondria", theme: "green" },
        { id: "fc4", front: "What is the process by which plants make food?", back: "Photosynthesis", theme: "green" }
      ]
    },
    {
      id: "default-formulas-1",
      name: "Essential Math",
      type: "formula",
      gradient: "from-fuchsia-500 to-purple-600",
      cards: [
        { id: "fm1", front: "Quadratic Formula", back: "x = [-b ± √(b² - 4ac)] / 2a", theme: "green" },
        { id: "fm2", front: "Pythagorean Theorem", back: "a² + b² = c²", theme: "purple" }
      ]
    },
    {
      id: "default-formulas-2",
      name: "Physics Equations",
      type: "formula",
      gradient: "from-orange-400 to-rose-500",
      cards: [
        { id: "fm3", front: "Force", back: "F = m * a", theme: "blue" },
        { id: "fm4", front: "Kinetic Energy", back: "KE = 1/2 * m * v²", theme: "rose" }
      ]
    }
  ],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = safeStorage.getItem("revisionMasterState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mergedUser = { ...defaultState.user, ...(parsed.user || {}) };
        // Migrate any legacy avatar (Unsplash / old avatar SVGs) to the friendly Bot default.
        if (isLegacyAvatar(mergedUser.avatar)) {
          mergedUser.avatar = botAvatar;
        }
        // Migrate: any invalid nav style → floating-pill
        if (mergedUser.navStyle && !["floating-pill", "attached", "glow", "segments", "minimal", "compact", "floating-glass"].includes(mergedUser.navStyle as string)) {
          mergedUser.navStyle = "floating-pill";
        }
        // Migrate: any invalid theme → light-cream
        const validThemes = ["light-cream","light-paper","light-sand","dark-plum","dark-graphite","dark-forest","dark-void"];
        if (mergedUser.theme && !validThemes.includes(mergedUser.theme as string)) {
          mergedUser.theme = "light-cream";
        }
        // Auto-clean expired bin items on load
        const retentionDays = mergedUser.recycleBinRetentionDays ?? 15;
        const now = Date.now();
        const rawBin: RecycleBinItem[] = parsed.recycleBin || [];
        const cleanedBin = mergedUser.recycleBinEnabled !== false
          ? rawBin.filter(item => {
              const age = (now - new Date(item.deletedAt).getTime()) / (1000 * 60 * 60 * 24);
              return age < retentionDays;
            })
          : [];

        return {
          ...defaultState,
          ...parsed,
          user: mergedUser,
          streak: { ...defaultState.streak, ...(parsed.streak || {}) },
          decks: parsed.decks || defaultState.decks,
          testStats: { ...defaultState.testStats, ...(parsed.testStats || {}) },
          recycleBin: cleanedBin,
        };
      } catch (e) {
        console.error("Failed to parse state from local storage", e);
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    const key = state.user.apiKeys?.gemini?.trim() || state.user.customApiKey?.trim();
    if (key && state.user.apiKeys?.gemini !== key) {
      setState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          apiKeys: {
            ...(prev.user.apiKeys || {}),
            gemini: key,
          },
          customApiKey: key,
        },
      }));
    }
  }, [state.user.apiKeys?.gemini, state.user.customApiKey]);

  // Persist state to localStorage immediately on every change.
  // We intentionally do NOT debounce — Capacitor's Android WebView can be
  // suspended or killed between state updates, so a 1-second debounce causes
  // data loss (e.g. API keys typed and saved appearing to "not save").
  useEffect(() => {
    safeStorage.setItem("revisionMasterState", JSON.stringify(state));
  }, [state]);

  // Extra safety: flush on web tab-close and Capacitor app-pause events.
  useEffect(() => {
    const flush = () => {
      safeStorage.setItem("revisionMasterState", JSON.stringify(state));
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    // Capacitor fires "pause" when the Android/iOS app goes to background.
    document.addEventListener("pause", flush);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("pause", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [state]);

  // Apply theme (only when theme changes)
  useEffect(() => {
    const root = window.document.documentElement;
    const themeId = normalizeTheme(state.user.theme);
    const isDark = themeId.startsWith("dark");
    root.classList.remove("light", "dark");
    root.classList.add(isDark ? "dark" : "light");
    root.setAttribute("data-theme", themeId);
  }, [state.user.theme]);

  // Apply animations preference
  useEffect(() => {
    const root = window.document.documentElement;
    if (state.user.animationsEnabled === false) {
      root.classList.add("no-animations");
    } else {
      root.classList.remove("no-animations");
    }
  }, [state.user.animationsEnabled]);

  // Apply system-default font preference
  useEffect(() => {
    const root = window.document.documentElement;
    if (state.user.useSystemFont) {
      root.classList.add("use-system-font");
    } else {
      root.classList.remove("use-system-font");
    }
  }, [state.user.useSystemFont]);

  // Apply theme aura preference
  useEffect(() => {
    const root = window.document.documentElement;
    if (state.user.auraEnabled !== false) {
      root.classList.add("use-aura");
    } else {
      root.classList.remove("use-aura");
    }
  }, [state.user.auraEnabled]);

  // Update favicon
  useEffect(() => {
    const favicon = document.getElementById("app-favicon") as HTMLLinkElement;
    if (favicon && state.user.appLogo) {
      favicon.href = state.user.appLogo;
    }
  }, [state.user.appLogo]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, ...updates },
    }));
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setState((prev) => {
      if (prev.streak.lastActiveDate === today) return prev; // Already updated today

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      let newCurrent = 1;
      if (prev.streak.lastActiveDate === yesterdayStr) {
        newCurrent = prev.streak.current + 1;
      }

      return {
        ...prev,
        user: {
          ...prev.user,
          xp: prev.user.xp + 50,
          level: getLevelFromXp(prev.user.xp + 50),
        },
        streak: {
          current: newCurrent,
          max: Math.max(prev.streak.max, newCurrent),
          lastActiveDate: today,
        },
      };
    });
  }, []);

  const resetOnboarding = useCallback(() => {
    setState(defaultState);
  }, []);

  const resetStats = useCallback(() => {
    setState((prev) => ({
      ...prev,
      streak: {
        current: 0,
        max: 0,
        lastActiveDate: null,
      },
      user: {
        ...prev.user,
        xp: 0,
        level: 1,
      },
      testStats: {
        cardCorrect: 0,
        cardWrong: 0,
        byDeck: {},
        daily: {},
        mockResults: [],
        lastUpdated: null,
      },
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activityLog: [],
      testStats: {
        ...prev.testStats,
        daily: {},
        mockResults: [],
        lastUpdated: null,
      },
    }));
  }, []);

  const recordCardResult = useCallback((deckId: string, mastered: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    setState((prev) => {
      const deck = prev.testStats.byDeck[deckId] || { correct: 0, wrong: 0 };
      return {
        ...prev,
        testStats: {
          ...prev.testStats,
          cardCorrect: prev.testStats.cardCorrect + (mastered ? 1 : 0),
          cardWrong: prev.testStats.cardWrong + (mastered ? 0 : 1),
          byDeck: {
            ...prev.testStats.byDeck,
            [deckId]: {
              correct: deck.correct + (mastered ? 1 : 0),
              wrong: deck.wrong + (mastered ? 0 : 1),
            },
          },
          daily: {
            ...prev.testStats.daily,
            [today]: (prev.testStats.daily[today] || 0) + 1,
          },
          lastUpdated: new Date().toISOString(),
        },
      };
    });
  }, []);

  const recordMockTestResult = useCallback(
    (result: Omit<MockTestResult, "id" | "takenAt">) => {
      const today = new Date().toISOString().split("T")[0];
      setState((prev) => ({
        ...prev,
        testStats: {
          ...prev.testStats,
          mockResults: [
            {
              ...result,
              id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
              takenAt: new Date().toISOString(),
            },
            ...prev.testStats.mockResults,
          ].slice(0, 50),
          daily: {
            ...prev.testStats.daily,
            [today]: (prev.testStats.daily[today] || 0) + result.total,
          },
          lastUpdated: new Date().toISOString(),
        },
      }));
    },
    [],
  );

  const recordPdfExport = useCallback(() => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        pdfExportCount: (prev.user.pdfExportCount || 0) + 1,
      },
    }));
  }, []);

  const resetCards = useCallback(() => {
    setState((prev) => ({
      ...prev,
      decks: [],
      activityLog: [],
    }));
  }, []);

  const addDeck = useCallback((deck: Deck) => {
    setState((prev) => ({
      ...prev,
      decks: [...prev.decks, deck],
    }));
  }, []);

  const updateDeck = useCallback((id: string, updates: Partial<Deck>) => {
    setState((prev) => ({
      ...prev,
      decks: prev.decks.map((deck) =>
        deck.id === id ? { ...deck, ...updates } : deck
      ),
    }));
  }, []);

  const deleteDeck = useCallback((id: string) => {
    setState((prev) => {
      const deck = prev.decks.find(d => d.id === id);
      if (prev.user.recycleBinEnabled !== false && deck) {
        const binItem: RecycleBinItem = {
          id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
          type: "deck",
          item: deck,
          deletedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          decks: prev.decks.filter(d => d.id !== id),
          recycleBin: [binItem, ...(prev.recycleBin || [])],
        };
      }
      return { ...prev, decks: prev.decks.filter(d => d.id !== id) };
    });
  }, []);

  const deleteCard = useCallback((deckId: string, cardId: string) => {
    setState((prev) => {
      const deck = prev.decks.find(d => d.id === deckId);
      if (!deck) return prev;
      const card = deck.cards.find(c => c.id === cardId);
      if (!card) return prev;
      if (prev.user.recycleBinEnabled !== false) {
        const binItem: RecycleBinItem = {
          id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
          type: "card",
          item: card,
          deletedAt: new Date().toISOString(),
          deckId,
          deckName: deck.name,
        };
        return {
          ...prev,
          decks: prev.decks.map(d => d.id === deckId ? { ...d, cards: d.cards.filter(c => c.id !== cardId) } : d),
          recycleBin: [binItem, ...(prev.recycleBin || [])],
        };
      }
      return {
        ...prev,
        decks: prev.decks.map(d => d.id === deckId ? { ...d, cards: d.cards.filter(c => c.id !== cardId) } : d),
      };
    });
  }, []);

  const addMockTest = useCallback((test: MockTest) => {
    setState((prev) => ({
      ...prev,
      mockTests: [...(prev.mockTests || []), test],
    }));
  }, []);

  const deleteMockTest = useCallback((id: string) => {
    setState((prev) => {
      const test = (prev.mockTests || []).find(t => t.id === id);
      if (prev.user.recycleBinEnabled !== false && test) {
        const binItem: RecycleBinItem = {
          id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
          type: "mock_test",
          item: test,
          deletedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          mockTests: (prev.mockTests || []).filter(t => t.id !== id),
          recycleBin: [binItem, ...(prev.recycleBin || [])],
        };
      }
      return { ...prev, mockTests: (prev.mockTests || []).filter(t => t.id !== id) };
    });
  }, []);

  const restoreFromBin = useCallback((binItemId: string) => {
    setState((prev) => {
      const binItem = (prev.recycleBin || []).find(i => i.id === binItemId);
      if (!binItem) return prev;
      const newBin = (prev.recycleBin || []).filter(i => i.id !== binItemId);
      if (binItem.type === "deck") {
        const deck = binItem.item as Deck;
        // Avoid duplicates
        const alreadyExists = prev.decks.some(d => d.id === deck.id);
        return {
          ...prev,
          decks: alreadyExists ? prev.decks : [...prev.decks, deck],
          recycleBin: newBin,
        };
      }
      if (binItem.type === "card" && binItem.deckId) {
        const card = binItem.item as Card;
        const deckExists = prev.decks.some(d => d.id === binItem.deckId);
        if (!deckExists) return { ...prev, recycleBin: newBin };
        return {
          ...prev,
          decks: prev.decks.map(d => {
            if (d.id !== binItem.deckId) return d;
            const alreadyHas = d.cards.some(c => c.id === card.id);
            return alreadyHas ? d : { ...d, cards: [...d.cards, card] };
          }),
          recycleBin: newBin,
        };
      }
      if (binItem.type === "mock_test") {
        const test = binItem.item as MockTest;
        const alreadyExists = (prev.mockTests || []).some(t => t.id === test.id);
        return {
          ...prev,
          mockTests: alreadyExists ? prev.mockTests : [...(prev.mockTests || []), test],
          recycleBin: newBin,
        };
      }
      return { ...prev, recycleBin: newBin };
    });
  }, []);

  const permanentlyDeleteFromBin = useCallback((binItemId: string) => {
    setState((prev) => ({
      ...prev,
      recycleBin: (prev.recycleBin || []).filter(i => i.id !== binItemId),
    }));
  }, []);

  const emptyRecycleBin = useCallback(() => {
    setState((prev) => ({ ...prev, recycleBin: [] }));
  }, []);

  const logActivity = useCallback((activity: Omit<Activity, "id" | "timestamp">) => {
    setState((prev) => ({
      ...prev,
      activityLog: [
        {
          ...activity,
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
        },
        ...(prev.activityLog || []),
      ].slice(0, 50), // Keep last 50 activities
    }));
  }, []);

  const importData = useCallback((data: any) => {
    try {
      if (data && data.user && data.streak) {
        setState({
          ...defaultState,
          ...data,
          user: { ...defaultState.user, ...(data.user || {}) },
          streak: { ...defaultState.streak, ...(data.streak || {}) },
          decks: data.decks || [],
        });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        updateUser,
        updateStreak,
        resetOnboarding,
        resetStats,
        clearHistory,
        resetCards,
        addDeck,
        updateDeck,
        deleteDeck,
        deleteCard,
        addMockTest,
        deleteMockTest,
        importData,
        logActivity,
        recordCardResult,
        recordMockTestResult,
        recordPdfExport,
        restoreFromBin,
        permanentlyDeleteFromBin,
        emptyRecycleBin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
