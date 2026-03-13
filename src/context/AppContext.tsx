import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Theme =
  | "light"
  | "dark"
  | "green"
  | "neon"
  | "blue"
  | "purple"
  | "oled"
  | "sunset"
  | "slate-gold"
  | "midnight-blue"
  | "cherry-blossom"
  | "hacker-green";

export interface User {
  name: string;
  age: string;
  examTarget: string;
  examDate?: string;
  customQuote?: string;
  avatar: string;
  appIcon?: string;
  theme: Theme;
  onboardingCompleted: boolean;
  xp: number;
  level: number;
  aiEnabled?: boolean;
  customApiKey?: string;
  autoUpdateEnabled?: boolean;
  lastUpdateSnoozedAt?: string | null;
  showSplashScreen?: boolean;
  navBarHeight?: number;
  navBarIconSize?: number;
  navBarHideLabels?: boolean;
  animationsEnabled?: boolean;
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

export interface AppState {
  user: User;
  streak: Streak;
  decks: Deck[];
  mockTests: MockTest[];
  activityLog: Activity[];
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
}

import avatar1 from '../assets/avatar1.svg';
import appIcon1 from '../assets/app-icon-1.svg';

const defaultState: AppState = {
  user: {
    name: "",
    age: "",
    examTarget: "",
    avatar: avatar1,
    appIcon: appIcon1,
    theme: "dark",
    onboardingCompleted: false,
    xp: 0,
    level: 1,
    aiEnabled: true,
    autoUpdateEnabled: true,
    lastUpdateSnoozedAt: null,
    showSplashScreen: true,
    navBarHeight: 56,
    navBarIconSize: 24,
    navBarHideLabels: false,
    animationsEnabled: true,
  },
  streak: {
    current: 0,
    max: 0,
    lastActiveDate: null,
  },
  activityLog: [],
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
        return {
          ...defaultState,
          ...parsed,
          user: { ...defaultState.user, ...(parsed.user || {}) },
          streak: { ...defaultState.streak, ...(parsed.streak || {}) },
          decks: parsed.decks || defaultState.decks,
        };
      } catch (e) {
        console.error("Failed to parse state from local storage", e);
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem("revisionMasterState", JSON.stringify(state));

    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove(
      "light",
      "dark",
      "green",
      "neon",
      "blue",
      "purple",
      "oled",
      "sunset",
      "slate-gold",
      "midnight-blue",
      "cherry-blossom",
      "hacker-green"
    );
    root.classList.add(state.user.theme);
  }, [state]);

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
