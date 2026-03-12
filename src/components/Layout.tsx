import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, BookOpen, BarChart2, User, Settings, Trophy } from "lucide-react";
import Chatbot from "./Chatbot";

const Layout = () => {
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
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {!shouldHideNav && (
        <>
          {location.pathname === "/" && <Chatbot />}
          <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-primary/10 bg-background-light/90 dark:bg-background-dark/95 backdrop-blur-xl px-4 pb-6 pt-3 safe-area-bottom">
          <div className="max-w-md mx-auto w-full flex justify-between items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
              }
            >
              {({ isActive }) => (
                <>
                  <Home
                    size={24}
                    className={isActive ? "fill-current" : ""}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Home
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/flashcards"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
              }
            >
              {({ isActive }) => (
                <>
                  <BookOpen
                    size={24}
                    className={isActive ? "fill-current" : ""}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Cards
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
              }
            >
              {({ isActive }) => (
                <>
                  <Settings
                    size={24}
                    className={isActive ? "fill-current" : ""}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Settings
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/developer"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"}`
              }
            >
              {({ isActive }) => (
                <>
                  <User
                    size={24}
                    className={isActive ? "fill-current" : ""}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    About
                  </span>
                </>
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
