/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import Layout from "./components/Layout";
import UpdateNotifier from "./components/UpdateNotifier";
import PdfExportProvider from "./components/PdfExportProvider";
import AiErrorProvider from "./components/AiErrorProvider";
import SupportPopup from "./components/SupportPopup";
import { MotionConfig } from "framer-motion";
import appLogo from "./assets/logo.svg";

const Onboarding = React.lazy(() => import("./screens/Onboarding"));
const Home = React.lazy(() => import("./screens/Home"));
const Flashcards = React.lazy(() => import("./screens/Flashcards"));
const MockTests = React.lazy(() => import("./screens/MockTests"));
const Stats = React.lazy(() => import("./screens/Stats"));
const FormulaLibrary = React.lazy(() => import("./screens/FormulaLibrary"));
const Settings = React.lazy(() => import("./screens/Settings"));
const About = React.lazy(() => import("./screens/About"));
const Changelog = React.lazy(() => import("./screens/Changelog"));
const RecycleBin = React.lazy(() => import("./screens/RecycleBin"));

const LoadingScreen = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-app">
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-0 -m-6 rounded-[36px] blur-3xl opacity-60 animate-pulse"
          style={{ background: "radial-gradient(closest-side, var(--color-primary), transparent 70%)" }}
        />
        <img
          src={appLogo}
          alt="Revision Master"
          className="relative size-24 rounded-3xl shadow-glow"
          style={{ filter: "drop-shadow(0 8px 28px color-mix(in srgb, var(--color-primary) 60%, transparent))" }}
        />
      </div>
      <p className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)]">
        Revision Master
      </p>
      <div className="h-1 w-32 rounded-full overflow-hidden" style={{ background: "var(--bg-surface-2)" }}>
        <div
          className="h-full w-1/3 rounded-full"
          style={{
            background: "var(--color-primary)",
            animation: "indeterminate 1.3s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  </div>
);

const AppRoutes = () => {
  const { state } = useAppContext();
  const location = useLocation();

  if (!state.user.onboardingCompleted && !location.pathname.startsWith("/onboarding")) {
    return <Navigate to="/onboarding/1" replace />;
  }

  return (
    <MotionConfig
      reducedMotion={state.user.animationsEnabled === false ? "always" : "user"}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="mobile-frame">
        <div className="mobile-frame__device">
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
                <Route path="/changelog" element={<Changelog />} />
                <Route path="/recycle-bin" element={<RecycleBin />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </MotionConfig>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AiErrorProvider>
          <PdfExportProvider>
            <UpdateNotifier />
            <SupportPopup />
            <AppRoutes />
          </PdfExportProvider>
        </AiErrorProvider>
      </BrowserRouter>
    </AppProvider>
  );
}
