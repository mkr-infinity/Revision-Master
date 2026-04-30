import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, BookOpen, FileText, Settings as SettingsIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

// Single brand accent (orchid / theme primary) for every tab — clean, mobile-style,
// and always visible regardless of theme background.
const NAV_ACCENT = "var(--color-primary)";

const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/flashcards", label: "Cards", Icon: BookOpen },
  { to: "/tests", label: "Tests", Icon: FileText },
  { to: "/settings", label: "Settings", Icon: SettingsIcon },
] as const;

const Layout: React.FC = () => {
  const { state } = useAppContext();
  const {
    navBarHeight = 68,
    navBarIconSize = 22,
    navBarHideLabels = false,
    navOrientation = "horizontal",
  } = state.user;

  const location = useLocation();
  const hideNavPaths = ["/onboarding"];
  const shouldHideNav = hideNavPaths.some((p) => location.pathname.startsWith(p));
  const isVertical = navOrientation === "vertical";

  const navHeight = Math.max(60, navBarHeight);

  return (
    <div
      className={`flex h-full w-full overflow-hidden anime-page-bg text-primary-fg font-display ${
        isVertical ? "flex-row" : "flex-col"
      }`}
    >
      <main
        className="flex-1 overflow-y-auto safe-area-top"
        style={{
          WebkitOverflowScrolling: "touch",
          // Floating Telegram-style navbar: the bar sits inset from the
          // bottom and the side edges with a small gap, so page content is
          // visible *around* it (left, right, and below). The scroll
          // container's padding-bottom equals the bar's full footprint
          // (bar height + side/bottom inset + safe-area) so the last item
          // can scroll fully into view above the floating bar, while
          // mid-scroll items pass behind it for the chat-list peek effect.
          paddingBottom: shouldHideNav
            ? "env(safe-area-inset-bottom, 0px)"
            : !isVertical
            ? `calc(${navHeight}px + 22px + env(safe-area-inset-bottom, 0px))`
            : "env(safe-area-inset-bottom, 0px)",
          paddingLeft:
            !shouldHideNav && isVertical
              ? `calc(88px + env(safe-area-inset-left))`
              : "env(safe-area-inset-left)",
        }}
      >
        <Outlet />
      </main>

      {!shouldHideNav && (
        <>
          {isVertical ? (
            <nav
              className="fixed left-0 top-1/2 -translate-y-1/2 z-50 safe-area-left"
              style={{ paddingLeft: "env(safe-area-inset-left)" }}
            >
              <div className="glass shadow-card-lg rounded-[28px] flex flex-col items-center gap-1 p-1.5 ml-2">
                {NAV_ITEMS.map(({ to, label, Icon }) => (
                  <NavLink key={to} to={to} end={to === "/"}>
                    {({ isActive }) => (
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ y: -1 }}
                        className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-colors ${
                          isActive ? "text-white" : "app-bottom-nav__icon"
                        }`}
                      >
                        {isActive && (
                          <>
                            <motion.div
                              layoutId="nav-pill-v"
                              transition={{ type: "spring", stiffness: 420, damping: 32 }}
                              className="absolute inset-0 rounded-2xl shadow-glow"
                              style={{
                                background: `linear-gradient(135deg, ${NAV_ACCENT}, color-mix(in srgb, ${NAV_ACCENT} 70%, #000))`,
                              }}
                            />
                            <motion.span
                              layoutId="nav-spark-v"
                              className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                            />
                          </>
                        )}
                        <Icon size={navBarIconSize} className="relative z-10" strokeWidth={isActive ? 2.6 : 2} />
                        {!navBarHideLabels && (
                          <span className="relative z-10 text-[9px] font-bold uppercase tracking-wider mt-0.5">
                            {label}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>
          ) : (
            // Floating Telegram-style: rounded capsule bar inset from the
            // bottom and side edges so page content is visible around it.
            // Wrapper is pointer-events-none so it never blocks taps on
            // page content peeking through the side/bottom gaps — only the
            // capsule itself is interactive.
            <nav
              className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
              style={{
                paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 12px)`,
                paddingLeft: `calc(env(safe-area-inset-left, 0px) + 10px)`,
                paddingRight: `calc(env(safe-area-inset-right, 0px) + 10px)`,
              }}
            >
              <div
                className="app-bottom-nav-capsule pointer-events-auto flex items-stretch justify-between w-full max-w-md relative overflow-hidden"
                style={{ height: navHeight }}
              >
                {NAV_ITEMS.map(({ to, label, Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className="flex-1 h-full relative"
                    aria-label={label}
                  >
                    {({ isActive }) => (
                      <motion.div
                        whileTap={{ scale: 0.92 }}
                        className="relative flex flex-col items-center justify-center h-full w-full"
                      >
                        {/* Sliding active pill behind the icon (shared layout id) */}
                        {isActive && (
                          <motion.span
                            layoutId="nav-capsule-pill"
                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                            aria-hidden
                            className="absolute inset-y-1.5 inset-x-1.5 rounded-2xl"
                            style={{
                              background: `linear-gradient(160deg, ${NAV_ACCENT}, color-mix(in srgb, ${NAV_ACCENT} 65%, #000))`,
                              boxShadow: `0 6px 16px -4px ${NAV_ACCENT}aa, inset 0 1px 0 rgba(255,255,255,0.25)`,
                            }}
                          />
                        )}

                        <motion.div
                          animate={{ y: isActive ? -1 : 0, scale: isActive ? 1.04 : 1 }}
                          transition={{ type: "spring", stiffness: 380, damping: 26 }}
                          className="relative z-10 flex flex-col items-center"
                        >
                          <Icon
                            size={navBarIconSize}
                            strokeWidth={isActive ? 2.6 : 2.1}
                            className={isActive ? "text-white" : "app-bottom-nav__icon"}
                          />
                          {!navBarHideLabels && (
                            <span
                              className="mt-0.5 text-[10px] font-bold tracking-wide leading-none"
                              style={{
                                color: isActive
                                  ? "#fff"
                                  : "color-mix(in srgb, var(--text-primary) 72%, transparent)",
                              }}
                            >
                              {label}
                            </span>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Layout;
