/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import Layout from "./components/Layout";
import Splash from "./screens/Splash";
import UpdateNotifier from "./components/UpdateNotifier";
import { AnimatePresence, MotionConfig } from "framer-motion";

const Onboarding = React.lazy(() => import("./screens/Onboarding"));
const Home = React.lazy(() => import("./screens/Home"));
const Flashcards = React.lazy(() => import("./screens/Flashcards"));
const MockTests = React.lazy(() => import("./screens/MockTests"));
const Stats = React.lazy(() => import("./screens/Stats"));
const FormulaLibrary = React.lazy(() => import("./screens/FormulaLibrary"));
const Settings = React.lazy(() => import("./screens/Settings"));
const About = React.lazy(() => import("./screens/About"));

const LoadingScreen = () => (
  <div className="h-screen w-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const AppRoutes = () => {
  const { state } = useAppContext();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(state.user.showSplashScreen ?? true);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  if (!state.user.onboardingCompleted && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding/1" replace />;
  }

  return (
    <MotionConfig 
      reducedMotion={state.user.animationsEnabled === false ? "always" : "user"}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="min-h-screen w-screen bg-background-light dark:bg-background-dark">
        <Suspense fallback={<LoadingScreen />}>
          <Routes location={location}>
            <Route path="/onboarding/:step" element={<Onboarding />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/tests" element={<MockTests />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/formulas" element={<FormulaLibrary />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </MotionConfig>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <UpdateNotifier />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
