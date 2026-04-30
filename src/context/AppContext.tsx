import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Theme =
  | "light-cream"
  | "light-paper"
  | "light-sand"
  | "dark-plum"
  | "dark-graphite"
  | "dark-forest"
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
  { id: "dark-graphite",  name: "Bleach",           mode: "dark",  swatch: "#0a1126", accent: "#48d8ff", surface: "#111a36" },
  { id: "dark-forest",    name: "Vinland Saga",     mode: "dark",  swatch: "#091815", accent: "#5fe3c7", surface: "#0f231e" },
];

export const normalizeTheme = (t?: Theme): Theme => {
  if (!t) return "dark-plum";
  if (t === "light") return "light-cream";
  if (t === "dark") return "dark-plum";
  return t;
};

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
  useSystemFont?: boolean;
  auraEnabled?: boolean;
  supportPromptShownStreak?: number | null;
  chatbotPosition?: { x: number; y: number } | null;
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
}

interface AppContextType {
  state: AppState;
  updateUser: (updates: Partial<User>) => void;
  updateStreak: () => void;
  resetOnboarding: () => void;
  resetStats: () => void;
  resetCards: () => void;
  addDeck: (deck: Deck) => void;
  updateDeck: (id: string, updates: Partial<Deck>) => void;
  deleteDeck: (id: string) => void;
  addMockTest: (test: MockTest) => void;
  deleteMockTest: (id: string) => void;
  importData: (data: any) => boolean;
  logActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
  recordCardResult: (deckId: string, mastered: boolean) => void;
  recordMockTestResult: (result: Omit<MockTestResult, "id" | "takenAt">) => void;
}

import appLogo from '../assets/logo.svg';
import botAvatar from '../assets/bot-avatar.svg';

export const BOT_AVATAR = botAvatar;
export const APP_LOGO = appLogo;

// Empty by design — we only ship a friendly Bot default + custom upload.
export const AVATARS: { id: string; src: string; name: string }[] = [];

const isLegacyAvatar = (src?: string) =>
  !!src && /images\.unsplash\.com|avatar-[mfMF]\d|\/avatar[1-6]\.svg/.test(src);

// Single official app logo. Kept as an array so any older selector UI keeps working.
export const APP_LOGOS = [
  { id: 'logo', src: appLogo, name: 'Revision Master' },
];

const defaultState: AppState = {
  user: {
    name: "",
    age: "",
    examTarget: "",
    avatar: botAvatar,
    appLogo: appLogo,
    theme: "dark-plum",
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
    auraEnabled: true,
    useSystemFont: false,
    supportPromptShownStreak: null,
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
    const saved = localStorage.getItem("revisionMasterState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mergedUser = { ...defaultState.user, ...(parsed.user || {}) };
        // Migrate any legacy avatar (Unsplash / old avatar SVGs) to the friendly Bot default.
        if (isLegacyAvatar(mergedUser.avatar)) {
          mergedUser.avatar = botAvatar;
        }
        return {
          ...defaultState,
          ...parsed,
          user: mergedUser,
          streak: { ...defaultState.streak, ...(parsed.streak || {}) },
          decks: parsed.decks || defaultState.decks,
          testStats: { ...defaultState.testStats, ...(parsed.testStats || {}) },
        };
      } catch (e) {
        console.error("Failed to parse state from local storage", e);
        return defaultState;
      }
    }
    return defaultState;
  });

  // Persist state to localStorage (debounced). Also flush on tab close so the
  // latest changes (e.g. font toggle) are never lost to the 1s debounce.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem("revisionMasterState", JSON.stringify(state));
      } catch (e) {
        console.error("Failed to persist state", e);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [state]);

  useEffect(() => {
    const flush = () => {
      try {
        localStorage.setItem("revisionMasterState", JSON.stringify(state));
      } catch {}
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
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
        streak: {
          current: newCurrent,
          max: Math.max(prev.streak.max, newCurrent),
          lastActiveDate: today,
        },
        user: {
          ...prev.user,
          xp: prev.user.xp + 50, // Give XP for daily activity
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
    setState((prev) => ({
      ...prev,
      decks: prev.decks.filter((deck) => deck.id !== id),
    }));
  }, []);

  const addMockTest = useCallback((test: MockTest) => {
    setState((prev) => ({
      ...prev,
      mockTests: [...(prev.mockTests || []), test],
    }));
  }, []);

  const deleteMockTest = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      mockTests: (prev.mockTests || []).filter((test) => test.id !== id),
    }));
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
        resetCards,
        addDeck,
        updateDeck,
        deleteDeck,
        addMockTest,
        deleteMockTest,
        importData,
        logActivity,
        recordCardResult,
        recordMockTestResult,
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
