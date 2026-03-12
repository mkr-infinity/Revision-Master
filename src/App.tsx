/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
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

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <UpdateNotifier />
        <Routes>
          <Route path="/splash" element={<Splash />} />
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

          <Route path="*" element={<Navigate to="/splash" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
