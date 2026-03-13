/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import Layout from "./components/Layout";
import Splash from "./screens/Splash";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import Flashcards from "./screens/Flashcards";
import MockTests from "./screens/MockTests";
import Stats from "./screens/Stats";
import FormulaLibrary from "./screens/FormulaLibrary";
import Settings from "./screens/Settings";
import DeveloperInfo from "./screens/DeveloperInfo";
import UpdateNotifier from "./components/UpdateNotifier";
import { AnimatePresence, MotionConfig } from "framer-motion";

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
    <MotionConfig reducedMotion={state.user.animationsEnabled === false ? "always" : "user"}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/onboarding/:step" element={<Onboarding />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/tests" element={<MockTests />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/formulas" element={<FormulaLibrary />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/developer" element={<DeveloperInfo />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
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
