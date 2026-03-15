import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Theme =
  | "light"
  | "dark"
  | "oled"
  | "slate-gold"
  | "hacker-green"
  | "graphite"
  | "material-dark"
  | "soft-light"
  | "sepia-light";

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

import appLogo1 from '../assets/app-icon-1.svg';
import appLogo2 from '../assets/app-icon-2.svg';
import appLogo3 from '../assets/app-icon-3.svg';
import appLogo4 from '../assets/app-icon-4.svg';
import appLogo5 from '../assets/app-icon-5.svg';
import appLogo6 from '../assets/app-icon-6.svg';
import appLogo7 from '../assets/app-icon-7.svg';
import appLogo8 from '../assets/app-icon-8.svg';
import logoUnique from '../assets/logo-unique.svg';

export const AVATARS = [
  { id: 'm1', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', name: 'Male 1' },
  { id: 'm2', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', name: 'Male 2' },
  { id: 'm3', src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop', name: 'Male 3' },
  { id: 'f1', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', name: 'Female 1' },
  { id: 'f2', src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', name: 'Female 2' },
  { id: 'f3', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', name: 'Female 3' },
];

export const APP_LOGOS = [
  { id: 'logo-unique', src: logoUnique, name: 'Master Unique' },
  { id: 'logo1', src: appLogo1, name: 'Default' },
  { id: 'logo2', src: appLogo2, name: 'Neon' },
  { id: 'logo3', src: appLogo3, name: 'Ocean' },
  { id: 'logo4', src: appLogo4, name: 'Sunset' },
  { id: 'logo5', src: appLogo5, name: 'Forest' },
  { id: 'logo6', src: appLogo6, name: 'Midnight' },
  { id: 'logo7', src: appLogo7, name: 'Cherry' },
  { id: 'logo8', src: appLogo8, name: 'Gold' },
];

const defaultState: AppState = {
  user: {
    name: "",
    age: "",
    examTarget: "",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    appLogo: logoUnique,
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
    decksLayout: "grid",
    decksSize: 1,
    navOrientation: "horizontal",
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
    const timeoutId = setTimeout(() => {
      localStorage.setItem("revisionMasterState", JSON.stringify(state));
    }, 1000); // Debounce save by 1 second

    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove(
      "light",
      "dark",
      "oled",
      "slate-gold",
      "hacker-green",
      "graphite",
      "material-dark",
      "soft-light",
      "sepia-light"
    );
    root.classList.add(state.user.theme);

    // Apply animations preference
    if (state.user.animationsEnabled === false) {
      root.classList.add("no-animations");
    } else {
      root.classList.remove("no-animations");
    }

    // Update favicon
    const favicon = document.getElementById("app-favicon") as HTMLLinkElement;
    if (favicon && state.user.appLogo) {
      favicon.href = state.user.appLogo;
    }

    return () => clearTimeout(timeoutId);
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
