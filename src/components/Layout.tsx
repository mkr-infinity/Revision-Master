import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, BookOpen, BarChart2, User, Settings, Trophy, FileText, Info } from "lucide-react";
import { motion } from "framer-motion";
import Chatbot from "./Chatbot";
import { useAppContext } from "../context/AppContext";

const Layout = () => {
  const { state } = useAppContext();
  const { 
    navBarHeight = 56, 
    navBarIconSize = 24, 
    navBarHideLabels = false,
    navOrientation = "horizontal"
  } = state.user;
  
  const location = useLocation();
  const hideNavPaths = [
    "/splash",
    "/onboarding",
  ];

  const shouldHideNav = hideNavPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  const isVertical = navOrientation === "vertical";

  return (
    <div className={`flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display ${isVertical ? 'flex-row' : 'flex-col'}`}>
      <main 
        className="flex-1 overflow-y-auto safe-area-top" 
        style={{ 
          WebkitOverflowScrolling: 'touch',
          paddingBottom: shouldHideNav ? 'env(safe-area-inset-bottom)' : (!isVertical ? `calc(${navBarHeight + 16}px + env(safe-area-inset-bottom))` : 'env(safe-area-inset-bottom)'),
          paddingLeft: !shouldHideNav && isVertical ? `calc(${navBarHeight}px + env(safe-area-inset-left))` : 'env(safe-area-inset-left)'
        }}
      >
        <Outlet />
      </main>

      {!shouldHideNav && (
        <>
          {location.pathname === "/" && <Chatbot />}
          <nav 
            className={`fixed z-50 flex border-primary/10 bg-background-light dark:bg-background-dark shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] gpu ${isVertical ? 'left-0 top-0 bottom-0 flex-col border-r w-[72px] py-8 safe-area-left' : 'bottom-0 left-0 right-0 border-t px-4 safe-area-bottom'}`}
            style={{ 
              height: isVertical ? '100vh' : `calc(${navBarHeight}px + env(safe-area-inset-bottom))`,
              width: isVertical ? `calc(${navBarHeight + 16}px + env(safe-area-inset-left))` : '100%'
            }}
          >
          <div className={`mx-auto w-full flex justify-between items-center ${isVertical ? 'flex-col gap-8 h-full py-4' : 'h-full max-w-md'}`}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center ${isVertical ? "w-full" : "h-full"} ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
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
                `flex flex-col items-center justify-center ${isVertical ? "w-full" : "h-full"} ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
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
              to="/tests"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center ${isVertical ? "w-full" : "h-full"} ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
              }
            >
              {({ isActive }) => (
                <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center justify-center">
                  <FileText
                    size={navBarIconSize}
                    className={isActive ? "fill-current" : ""}
                  />
                  {!navBarHideLabels && (
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      Tests
                    </span>
                  )}
                </motion.div>
              )}
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center ${isVertical ? "w-full" : "h-full"} ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
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
          </div>
        </nav>
        </>
      )}
    </div>
  );
};

export default Layout;
