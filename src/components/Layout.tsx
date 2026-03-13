import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, BookOpen, BarChart2, User, Settings, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Chatbot from "./Chatbot";
import { useAppContext } from "../context/AppContext";

const Layout = () => {
  const { state } = useAppContext();
  const { 
    navBarHeight = 56, 
    navBarIconSize = 24, 
    navBarHideLabels = false 
  } = state.user;
  
  const location = useLocation();
  const hideNavPaths = [
    "/splash",
    "/onboarding",
  ];

  const shouldHideNav = hideNavPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: shouldHideNav ? 0 : navBarHeight + 16 }}>
        <Outlet />
      </main>

      {!shouldHideNav && (
        <>
          {location.pathname === "/" && <Chatbot />}
          <nav 
            className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-primary/10 bg-background-light/90 dark:bg-background-dark/95 backdrop-blur-xl px-4 safe-area-bottom"
            style={{ height: navBarHeight }}
          >
          <div className="max-w-md mx-auto w-full flex justify-between items-center h-full">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
              }
            >
              {({ isActive }) => (
                <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center justify-center">
                  <Home
                    size={navBarIconSize}
                    className={isActive ? "fill-current" : ""}
                  />
                  {!navBarHideLabels && (
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      Home
                    </span>
                  )}
                </motion.div>
              )}
            </NavLink>

            <NavLink
              to="/flashcards"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
              }
            >
              {({ isActive }) => (
                <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center justify-center">
                  <BookOpen
                    size={navBarIconSize}
                    className={isActive ? "fill-current" : ""}
                  />
                  {!navBarHideLabels && (
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      Cards
                    </span>
                  )}
                </motion.div>
              )}
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
              }
            >
              {({ isActive }) => (
                <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center justify-center">
                  <Settings
                    size={navBarIconSize}
                    className={isActive ? "fill-current" : ""}
                  />
                  {!navBarHideLabels && (
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      Settings
                    </span>
                  )}
                </motion.div>
              )}
            </NavLink>

            <NavLink
              to="/developer"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
              }
            >
              {({ isActive }) => (
                <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center justify-center">
                  <User
                    size={navBarIconSize}
                    className={isActive ? "fill-current" : ""}
                  />
                  {!navBarHideLabels && (
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      About
                    </span>
                  )}
                </motion.div>
              )}
            </NavLink>
          </div>
        </nav>
        </>
      )}
    </div>
  );
};

export default Layout;
