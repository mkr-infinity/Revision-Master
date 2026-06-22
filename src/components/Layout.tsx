import React, { useMemo } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, BookOpen, FileText, Settings as SettingsIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

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
    navBarHeight = 62,
    navBarIconSize = 22,
    navBarHideLabels = false,
    navOrientation = "horizontal",
    navStyle = "floating-pill",
    customBgImage,
    disableBgImage,
    customBgOpacity,
    theme,
  } = state.user;

  const location = useLocation();
  const hideNavPaths = ["/onboarding"];
  const shouldHideNav = hideNavPaths.some((p) => location.pathname.startsWith(p));
  const isVertical = false;
  const navHeight = Math.max(60, navBarHeight);
  const navVariantClass =
    navStyle === "attached"
      ? "app-bottom-nav-attached"
      : navStyle === "glow"
      ? "app-bottom-nav-glow"
      : navStyle === "segments"
      ? "app-bottom-nav-segments"
      : navStyle === "minimal"
      ? "app-bottom-nav-minimal"
      : navStyle === "compact"
      ? "app-bottom-nav-compact"
      : navStyle === "floating-glass"
      ? "app-bottom-nav-glass"
      : "app-bottom-nav-capsule";

  const contentPaddingBottom = shouldHideNav
    ? "env(safe-area-inset-bottom, 0px)"
    : navStyle === "attached"
    ? `calc(${navHeight}px + env(safe-area-inset-bottom, 0px))`
    : `calc(${navHeight}px + 24px + env(safe-area-inset-bottom, 0px))`;

  const wallpaperStyle = useMemo(() => {
    const darkThemes = ["dark-plum", "dark-graphite", "dark-forest", "dark-void", "dark"];
    const isDark = darkThemes.includes(theme ?? "light-cream");
    const themeBgRgb: Record<string, string> = {
      "light-cream": "255,235,242",
      "light-paper": "232,240,255",
      "light-sand": "255,238,215",
      "dark-plum": "14,8,32",
      "dark-graphite": "2,9,18",
      "dark-forest": "8,22,28",
      "dark-void": "3,3,12",
    };
    const bgRgb = themeBgRgb[theme ?? "light-cream"] ?? (isDark ? "10,10,20" : "255,255,255");
    const bgOpacityPct = customBgOpacity ?? 40;
    const base = (100 - bgOpacityPct) / 100;
    const top = Math.max(0.06, base * 0.72).toFixed(2);
    const mid = Math.max(0.14, base * 0.85).toFixed(2);
    const bot = Math.min(0.96, Math.max(0.30, base * 0.95)).toFixed(2);
    return {
      backgroundImage: disableBgImage
        ? "none"
        : customBgImage
        ? `url(${customBgImage})`
        : "none",
      backgroundSize: disableBgImage ? "auto" : "cover",
      backgroundPosition: disableBgImage ? "center" : "center top",
      backgroundRepeat: "no-repeat",
      backgroundColor: disableBgImage ? `rgba(${bgRgb},1)` : `rgba(${bgRgb},${bot})`,
      boxShadow: disableBgImage
        ? "none"
        : `inset 0 0 0 9999px rgba(${bgRgb},${top}), inset 0 -20vh 18vh rgba(${bgRgb},${mid})`,
      backgroundAttachment: disableBgImage ? "scroll" : "fixed",
    };
  }, [customBgImage, customBgOpacity, disableBgImage, theme]);

  /* ── Shared tab renderer for horizontal bars ── */
  const renderTabs = (activeStyle: "pill" | "underline") =>
    NAV_ITEMS.map(({ to, label, Icon }) => (
      <NavLink key={to} to={to} end={to === "/"} className="flex-1 h-full relative" aria-label={label}>
        {({ isActive }) => (
          <motion.div
            whileTap={{ scale: 0.92 }}
            className="relative flex flex-col items-center justify-center h-full w-full"
          >
            {isActive && activeStyle === "pill" && (
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
            {isActive && activeStyle === "underline" && (
              <motion.span
                layoutId="nav-attached-line"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                aria-hidden
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                style={{ background: NAV_ACCENT }}
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
                className={isActive && activeStyle === "pill" ? "text-white" : isActive ? "" : "app-bottom-nav__icon"}
                style={isActive && activeStyle !== "pill" ? { color: NAV_ACCENT } : {}}
              />
              {!navBarHideLabels && (
                <span
                  className="mt-0.5 text-[10px] font-bold tracking-wide leading-none"
                  style={{
                    color: isActive
                      ? activeStyle === "pill" ? "#fff" : NAV_ACCENT
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
    ));

  const wallpaperPosition = useMemo(() => {
    if (disableBgImage) return "center";
    return customBgImage ? "center" : "center top";
  }, [customBgImage, disableBgImage]);

  return (
    <div
      className="layout-shell flex h-full w-full overflow-hidden text-primary-fg font-display flex-col"
    >
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -10,
          ...wallpaperStyle,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundAttachment: "fixed",
          backgroundPosition: wallpaperPosition,
        }}
      />

      <main
        className="flex-1 overflow-y-auto"
        style={{
          WebkitOverflowScrolling: "touch",
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingBottom: contentPaddingBottom,
          paddingLeft: "env(safe-area-inset-left, 0px)",
          position: "relative",
          zIndex: 1,
          background: "transparent",
        }}
      >
        <Outlet />
      </main>

      {!shouldHideNav && (
        <>
          {navStyle === "attached" ? (
            /* ── Style 2: Attached — full-width flat bar stuck to bottom ── */
            <nav
              className="fixed bottom-0 left-0 right-0 z-50"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              <div
                className={`${navVariantClass} flex items-stretch justify-between w-full max-w-[min(100vw-16px,720px)] relative overflow-hidden`}
                style={{ height: navHeight }}
              >
                {renderTabs("underline")}
              </div>
            </nav>

          ) : navStyle === "glow" ? (
            /* ── Style 3: Glow — transparent floating bar, active icon gets a radial halo ── */
            <nav
              className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
              style={{
                paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 10px)`,
                paddingLeft: `calc(env(safe-area-inset-left, 0px) + 8px)`,
                paddingRight: `calc(env(safe-area-inset-right, 0px) + 8px)`,
              }}
            >
              <div
                className={`${navVariantClass} pointer-events-auto flex items-stretch justify-between w-full max-w-[min(100vw-16px,420px)] overflow-hidden`}
                style={{
                  height: navHeight,
                }}
              >
                {NAV_ITEMS.map(({ to, label, Icon }) => (
                  <NavLink key={to} to={to} end={to === "/"} className="flex-1 h-full relative" aria-label={label}>
                    {({ isActive }) => (
                      <motion.div
                        whileTap={{ scale: 0.88 }}
                        className="relative flex flex-col items-center justify-center h-full w-full gap-0.5"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="nav-glow-halo"
                            className="absolute rounded-2xl"
                            style={{
                              inset: "6px 4px",
                              background: `radial-gradient(ellipse at 50% 65%, color-mix(in srgb, var(--color-primary) 28%, transparent) 0%, transparent 72%)`,
                            }}
                            transition={{ type: "spring", stiffness: 380, damping: 28 }}
                          />
                        )}
                        <motion.div
                          animate={{ y: isActive ? -1.5 : 0, scale: isActive ? 1.06 : 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 24 }}
                          className="relative z-10 flex flex-col items-center gap-0.5"
                        >
                          <Icon
                            size={navBarIconSize}
                            strokeWidth={isActive ? 2.6 : 2}
                            style={{
                              color: isActive ? NAV_ACCENT : "color-mix(in srgb, var(--text-primary) 48%, transparent)",
                              filter: isActive ? `drop-shadow(0 0 8px color-mix(in srgb, var(--color-primary) 80%, transparent))` : "none",
                            }}
                          />
                          {!navBarHideLabels && (
                            <span
                              className="text-[9px] font-bold tracking-wide leading-none"
                              style={{ color: isActive ? NAV_ACCENT : "color-mix(in srgb, var(--text-primary) 38%, transparent)" }}
                            >
                              {label}
                            </span>
                          )}
                        </motion.div>
                        {isActive && (
                          <motion.span
                            layoutId="nav-glow-dot"
                            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1 rounded-full"
                            style={{
                              background: NAV_ACCENT,
                              boxShadow: `0 0 6px 2px color-mix(in srgb, var(--color-primary) 70%, transparent)`,
                            }}
                          />
                        )}
                      </motion.div>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>

          ) : navStyle === "segments" ? (
            /* ── Style 4: Segments — divided pill with sliding active panel ── */
            <nav
              className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
              style={{
                paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 12px)`,
                paddingLeft: `calc(env(safe-area-inset-left, 0px) + 10px)`,
                paddingRight: `calc(env(safe-area-inset-right, 0px) + 10px)`,
              }}
            >
              <div
                className={`${navVariantClass} pointer-events-auto relative flex items-stretch w-full max-w-[min(100vw-20px,560px)] overflow-hidden`}
                style={{
                  height: navHeight,
                }}
              >
                {NAV_ITEMS.map(({ to, label, Icon }) => (
                  <NavLink key={to} to={to} end={to === "/"} className="flex-1 h-full relative" aria-label={label}>
                    {({ isActive }) => (
                      <motion.div
                        whileTap={{ scale: 0.93 }}
                        className="relative flex flex-col items-center justify-center h-full w-full gap-0.5 z-10 border-r last:border-r-0"
                        style={{
                          borderColor: "color-mix(in srgb, var(--theme-nav-border, var(--border-subtle)) 60%, transparent)",
                        }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="nav-seg-active"
                            className="absolute"
                            style={{
                              inset: "4px 4px",
                              borderRadius: 14,
                              background: `linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 88%, #fff 12%) 0%, color-mix(in srgb, var(--color-primary) 68%, #000) 100%)`,
                              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.24), 0 6px 14px -6px color-mix(in srgb, var(--color-primary) 70%, transparent)`,
                            }}
                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                          />
                        )}
                        <Icon
                          size={navBarIconSize - 2}
                          strokeWidth={isActive ? 2.6 : 2}
                          className={`relative z-10 ${isActive ? "text-white" : "app-bottom-nav__icon"}`}
                        />
                        {!navBarHideLabels && (
                          <span
                            className="relative z-10 text-[9px] font-bold tracking-wide leading-none"
                            style={{
                              color: isActive
                                ? "rgba(255,255,255,0.92)"
                                : "color-mix(in srgb, var(--text-primary) 52%, transparent)",
                            }}
                          >
                            {label}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>

          ) : navStyle === "minimal" ? (
            <nav
              className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
              style={{
                paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 8px)`,
                paddingLeft: `calc(env(safe-area-inset-left, 0px) + 8px)`,
                paddingRight: `calc(env(safe-area-inset-right, 0px) + 8px)`,
              }}
            >
              <div className={`${navVariantClass} pointer-events-auto flex items-stretch justify-between w-full max-w-[min(100vw-16px,360px)] overflow-hidden`} style={{ height: Math.max(52, navHeight - 8) }}>
                {renderTabs("underline")}
              </div>
            </nav>

          ) : navStyle === "compact" ? (
            <nav
              className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
              style={{
                paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 10px)`,
                paddingLeft: `calc(env(safe-area-inset-left, 0px) + 10px)`,
                paddingRight: `calc(env(safe-area-inset-right, 0px) + 10px)`,
              }}
            >
              <div className={`${navVariantClass} pointer-events-auto flex items-stretch justify-between w-full max-w-[min(100vw-16px,320px)] overflow-hidden`} style={{ height: Math.max(50, navHeight - 10) }}>
                {renderTabs("pill")}
              </div>
            </nav>

          ) : navStyle === "floating-glass" ? (
            <nav
              className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
              style={{
                paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 12px)`,
                paddingLeft: `calc(env(safe-area-inset-left, 0px) + 10px)`,
                paddingRight: `calc(env(safe-area-inset-right, 0px) + 10px)`,
              }}
            >
              <div className={`${navVariantClass} pointer-events-auto flex items-stretch justify-between w-full max-w-[min(100vw-20px,520px)] overflow-hidden`} style={{ height: navHeight + 2 }}>
                {renderTabs("pill")}
              </div>
            </nav>

          ) : (
            /* ── Style 1: Floating Pill (default) ── */
            <nav
              className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
              style={{
                paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 12px)`,
                paddingLeft: `calc(env(safe-area-inset-left, 0px) + 10px)`,
                paddingRight: `calc(env(safe-area-inset-right, 0px) + 10px)`,
              }}
            >
              <div
                className="app-bottom-nav-capsule pointer-events-auto flex items-stretch justify-between w-full max-w-[min(100vw-20px,520px)] relative overflow-hidden"
                style={{ height: navHeight }}
              >
                {renderTabs("pill")}
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Layout;
