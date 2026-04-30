import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Database,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Settings as SettingsIcon,
  Star,
  Upload,
  Download,
  Code,
  Edit2,
  X,
  Bot,
  Sparkles,
  ChevronDown,
  Heart,
  Coffee,
  Github,
  Globe,
  Smartphone,
  LayoutGrid,
  FileText,
  List,
  Info,
  Bug,
  Lightbulb,
  Eye,
  EyeOff,
  Check
} from "lucide-react";
import { useAppContext, Theme, AVATARS, THEMES, normalizeTheme } from "../context/AppContext";
import { usePdfExport } from "../components/PdfExportProvider";
import { PROVIDERS, AiProvider } from "../utils/ai";

const REPO_URL = "https://github.com/mkr-infinity/Revision-Master";
const APP_VERSION = "2.0.0";

const BUG_TEMPLATE = `## Describe the bug
<!-- A clear, concise description of what the bug is -->

## Steps to reproduce
1. Go to '...'
2. Tap on '...'
3. See error

## Expected behavior
<!-- What did you expect to happen? -->

## Screenshots
<!-- If applicable, add screenshots or a screen recording -->

## Device info
- App version: ${APP_VERSION}
- Device model:
- Android version:

## Additional context
<!-- Anything else worth mentioning -->
`;

const FEATURE_TEMPLATE = `## Summary
<!-- One-line description of the feature you'd like -->

## Problem it solves
<!-- What problem or limitation does this address? -->

## Proposed solution
<!-- How should this feature work? Walk us through it -->

## Alternatives considered
<!-- Other approaches you thought about -->

## Additional context
<!-- Mockups, references, related issues, anything helpful -->
`;

const buildIssueUrl = (kind: "bug" | "feature") => {
  const isBug = kind === "bug";
  const params = new URLSearchParams({
    title: isBug ? "[Bug]: " : "[Feature]: ",
    labels: isBug ? "bug" : "enhancement",
    body: isBug ? BUG_TEMPLATE : FEATURE_TEMPLATE,
  });
  return `${REPO_URL}/issues/new?${params.toString()}`;
};

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, updateUser, resetStats, resetOnboarding, resetCards, importData } = useAppContext();
  const { startExport } = usePdfExport();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modalType, setModalType] = useState<"none" | "resetStats" | "restartOnboarding" | "editProfile" | "aiSettings" | "resetCards" | "updateSettings" | "exportOptions">("none");
  const [editName, setEditName] = useState(state.user.name);
  const [editExam, setEditExam] = useState(state.user.examTarget);
  const [editAvatar, setEditAvatar] = useState(state.user.avatar);
  const [editExamDate, setEditExamDate] = useState(state.user.examDate || "");
  const [editCustomQuote, setEditCustomQuote] = useState(state.user.customQuote || "");
  const [editApiKey, setEditApiKey] = useState(state.user.customApiKey || "");
  const [editProvider, setEditProvider] = useState<AiProvider>(
    (state.user.aiProvider as AiProvider) || "gemini",
  );
  const [editKeys, setEditKeys] = useState<Partial<Record<AiProvider, string>>>(
    state.user.apiKeys || {},
  );
  const [showKeyFor, setShowKeyFor] = useState<AiProvider | null>(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const [isDecksExpanded, setIsDecksExpanded] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // When navigated here from the AI error modal ("Open AI settings"),
  // automatically open the AI Settings popup.
  useEffect(() => {
    const navState = location.state as { openModal?: string } | null;
    if (navState?.openModal === "aiSettings") {
      setModalType("aiSettings");
      // Clear the state so refreshes don't re-open it.
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);


  const noUpdateMessages = [
    "Already newest version",
    "Developer needs support, updating support him",
    "Developer is sleeping, update later",
    "More toast messages",
    "MKR Ai is optimizing the code, wait..."
  ];

  useEffect(() => {
    const handleUpdateResult = (e: any) => {
      const { hasUpdate, latestVersion, error, isManual } = e.detail;
      setCheckingUpdate(false);

      // An update was found → always toast (auto OR manual). The popup appears
      // on top, but the toast lives above it (z-index + top placement) so it's
      // never hidden behind the modal.
      if (hasUpdate) {
        showToast(`New version available: ${latestVersion}`, "info");
        return;
      }

      // No update / error → only surface a toast when the user explicitly
      // pressed "Check for Updates". Silent on auto-checks.
      if (!isManual) return;

      if (error) {
        showToast(`Update check failed: ${error}`, "error");
      } else {
        showToast("You are using the latest version!", "success");
      }
    };

    window.addEventListener('update-check-result', handleUpdateResult);
    return () => window.removeEventListener('update-check-result', handleUpdateResult);
  }, []);

  const handleCheckUpdate = async () => {
    setCheckingUpdate(true);
    try {
      // Dispatch event for UpdateNotifier to check
      window.dispatchEvent(new CustomEvent('check-for-updates'));
      showToast("Checking for updates...", "info");
    } catch (error) {
      setCheckingUpdate(false);
      showToast("Failed to initiate update check", "error");
    }
  };
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetStats = () => {
    resetStats();
    setModalType("none");
    alert("Stats reset successfully. Your cards are safe.");
  };

  const handleResetCards = () => {
    resetCards();
    setModalType("none");
    alert("All cards and decks have been permanently deleted.");
  };

  const handleRestartOnboarding = () => {
    resetOnboarding();
    setModalType("none");
    navigate("/onboarding/1");
  };

  const handleEditProfile = () => {
    updateUser({ 
      name: editName, 
      examTarget: editExam, 
      avatar: editAvatar,
      examDate: editExamDate,
      customQuote: editCustomQuote
    });
    setModalType("none");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "revision_master_backup.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (importData(json)) {
          alert("Data imported successfully!");
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Error reading backup file.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="font-display text-slate-900 dark:text-slate-100 pb-12"
    >
      <header
        className="sticky top-0 z-50 glass px-4 pb-4 flex items-center gap-3 border-b border-primary/10"
        style={{ paddingTop: `calc(env(safe-area-inset-top) + 16px)` }}
      >
        <div className="size-10 rounded-lg bg-gradient-to-tr from-primary via-blue-500 to-teal-400 flex items-center justify-center shadow-lg shadow-primary/20">
          <SettingsIcon className="text-white" size={24} />
        </div>
        <h1 className="font-anime-pop text-2xl tracking-tight">Settings</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 space-y-8 mt-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-primary p-1 bg-background-dark overflow-hidden">
              <img
                src={state.user.avatar}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-background-dark">
              LV {state.user.level}
            </div>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setEditName(state.user.name);
                setEditExam(state.user.examTarget);
                setEditAvatar(state.user.avatar);
                setModalType("editProfile");
              }}
              className="absolute -top-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-background-dark hover:scale-110 transition-transform"
            >
              <Edit2 size={14} />
            </motion.button>
          </div>
          <h2 className="text-2xl font-bold">{state.user.name || "Scholar"}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {state.user.examTarget || "No Exam Selected"}
          </p>
        </div>

        <motion.section 
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/about")}
          className="relative overflow-hidden bg-white/5 dark:bg-black/20 rounded-[2.5rem] p-6 shadow-sm border border-primary/10 cursor-pointer group hover:bg-primary/5 transition-colors"
        >
          {/* Subtle decorative background elements */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20 group-hover:scale-110 transition-transform">
                <Info size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  About App
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">
                  Version {APP_VERSION}
                </p>
              </div>
            </div>
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:translate-x-1 transition-transform">
              <ChevronRight size={20} />
            </div>
          </div>
        </motion.section>

        <section className="bg-white/5 dark:bg-black/20 rounded-[2.5rem] p-2 border border-primary/10 shadow-sm">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between p-4 cursor-pointer group rounded-[2rem] hover:bg-primary/5 transition-colors"
            onClick={() => setIsThemeExpanded(!isThemeExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Palette size={20} />
              </div>
              <h2 className="text-lg font-bold">Appearance</h2>
            </div>
            <motion.div
              animate={{ rotate: isThemeExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="text-slate-400 group-hover:text-primary transition-colors" size={20} />
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={false}
            animate={{ 
              height: isThemeExpanded ? "auto" : "0px", 
              opacity: isThemeExpanded ? 1 : 0,
              marginTop: isThemeExpanded ? 8 : 0
            }}
            className="overflow-hidden px-2"
          >
            <div className="p-2 space-y-4">
              {(["light", "dark"] as const).map((mode) => (
                <div key={mode}>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-tertiary-fg px-1 mb-2">
                    {mode === "light" ? "Light themes" : "Dark themes"}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {THEMES.filter((t) => t.mode === mode).map((t) => {
                      const active = normalizeTheme(state.user.theme) === t.id;
                      return (
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          key={t.id}
                          onClick={() => updateUser({ theme: t.id })}
                          className={`group relative rounded-2xl overflow-hidden border-2 transition-all text-left ${
                            active
                              ? "border-primary shadow-glow"
                              : "border-transparent hover:border-primary/30"
                          }`}
                        >
                          <div
                            className="aspect-[3/4] flex flex-col p-2 gap-1.5"
                            style={{ background: t.swatch }}
                          >
                            <div
                              className="h-2 rounded-full w-1/2"
                              style={{ background: t.accent, opacity: 0.9 }}
                            />
                            <div
                              className="flex-1 rounded-lg"
                              style={{ background: t.surface }}
                            />
                            <div className="flex gap-1">
                              <div
                                className="h-2 flex-1 rounded-full"
                                style={{ background: t.accent }}
                              />
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ background: t.surface }}
                              />
                            </div>
                          </div>
                          <div className="p-2 bg-elevated">
                            <p className={`text-[10px] font-black uppercase tracking-wider truncate ${active ? "text-primary" : "text-secondary-fg"}`}>
                              {t.name}
                            </p>
                          </div>
                          {active && (
                            <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow">
                              <Star size={10} fill="currentColor" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="mt-2 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-tight">Use system default font</p>
                  <p className="text-[11px] text-tertiary-fg leading-snug mt-0.5">
                    Switches off the anime fonts and uses your device's default font instead.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!state.user.useSystemFont}
                  onClick={() => updateUser({ useSystemFont: !state.user.useSystemFont })}
                  className={`relative shrink-0 w-12 h-7 rounded-full transition-colors ${
                    state.user.useSystemFont ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform ${
                      state.user.useSystemFont ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-2 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-tight flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary" />
                    Theme aura
                  </p>
                  <p className="text-[11px] text-tertiary-fg leading-snug mt-0.5">
                    Adds a glowing anime aura around buttons, panels and the
                    background — Gojo's cursed energy, Naruto's chakra, Tanjiro's
                    flame, depending on your theme.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={state.user.auraEnabled !== false}
                  onClick={() => updateUser({ auraEnabled: !(state.user.auraEnabled !== false) })}
                  className={`relative shrink-0 w-12 h-7 rounded-full transition-colors ${
                    state.user.auraEnabled !== false ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform ${
                      state.user.auraEnabled !== false ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="bg-white/5 dark:bg-black/20 rounded-[2.5rem] p-2 border border-primary/10 shadow-sm">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between p-4 cursor-pointer group rounded-[2rem] hover:bg-primary/5 transition-colors"
            onClick={() => setIsDecksExpanded(!isDecksExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <LayoutGrid size={20} />
              </div>
              <h2 className="text-lg font-bold">Decks UI</h2>
            </div>
            <motion.div
              animate={{ rotate: isDecksExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="text-slate-400 group-hover:text-primary transition-colors" size={20} />
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={false}
            animate={{ 
              height: isDecksExpanded ? "auto" : "0px", 
              opacity: isDecksExpanded ? 1 : 0,
              marginTop: isDecksExpanded ? 8 : 0
            }}
            className="overflow-hidden px-4 pb-4"
          >
            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-bold">Layout Style</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateUser({ decksLayout: "grid" })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${state.user.decksLayout === "grid" ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-800 text-slate-500"}`}
                  >
                    <LayoutGrid size={18} />
                    <span className="font-bold text-xs uppercase">Grid</span>
                  </button>
                  <button
                    onClick={() => updateUser({ decksLayout: "list" })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${state.user.decksLayout === "list" ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-800 text-slate-500"}`}
                  >
                    <List size={18} />
                    <span className="font-bold text-xs uppercase">List</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold">Card Size</label>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">{Math.round((state.user.decksSize || 1) * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.1"
                  value={state.user.decksSize || 1} 
                  onChange={(e) => updateUser({ decksSize: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <button
                onClick={() => updateUser({ decksLayout: "grid", decksSize: 1 })}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <RefreshCw size={14} />
                Reset to Default
              </button>
            </div>
          </motion.div>
        </section>

        <section className="bg-white/5 dark:bg-black/20 rounded-[2.5rem] p-2 border border-primary/10 shadow-sm">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between p-4 cursor-pointer group rounded-[2rem] hover:bg-primary/5 transition-colors"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Smartphone size={20} />
              </div>
              <h2 className="text-lg font-bold">Navigation Panel</h2>
            </div>
            <motion.div
              animate={{ rotate: isNavExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="text-slate-400 group-hover:text-primary transition-colors" size={20} />
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={false}
            animate={{ 
              height: isNavExpanded ? "auto" : "0px", 
              opacity: isNavExpanded ? 1 : 0,
              marginTop: isNavExpanded ? 8 : 0
            }}
            className="overflow-hidden px-4 pb-4"
          >
            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-bold">Orientation</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateUser({ navOrientation: "horizontal" })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${state.user.navOrientation === "horizontal" ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-800 text-slate-500"}`}
                  >
                    <div className="w-6 h-1 bg-current rounded-full"></div>
                    <span className="font-bold text-xs uppercase">Bottom</span>
                  </button>
                  <button
                    onClick={() => updateUser({ navOrientation: "vertical" })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${state.user.navOrientation === "vertical" ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-800 text-slate-500"}`}
                  >
                    <div className="w-1 h-6 bg-current rounded-full"></div>
                    <span className="font-bold text-xs uppercase">Side</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold">Bar Height</label>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">{state.user.navBarHeight}px</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  value={state.user.navBarHeight || 56} 
                  onChange={(e) => updateUser({ navBarHeight: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold">Icon Size</label>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">{state.user.navBarIconSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="16" 
                  max="32" 
                  value={state.user.navBarIconSize || 24} 
                  onChange={(e) => updateUser({ navBarIconSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Hide Labels</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Icon-only mode</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={state.user.navBarHideLabels || false}
                    onChange={(e) => updateUser({ navBarHideLabels: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <button
                onClick={() =>
                  updateUser({
                    navOrientation: "horizontal",
                    navBarHeight: 56,
                    navBarIconSize: 24,
                    navBarHideLabels: false,
                  })
                }
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <RefreshCw size={14} />
                Reset to Default
              </button>
            </div>
          </motion.div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Database className="text-primary" size={20} />
            <h2 className="text-lg font-bold">Data Management</h2>
          </div>
          <div className="bg-white/5 dark:bg-black/20 border border-primary/10 rounded-[2rem] overflow-hidden p-2 space-y-2">
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              onChange={handleImport} 
              className="hidden" 
            />
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Upload size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Import All Data</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Restore from backup
                  </p>
                </div>
              </div>
              <ChevronRight
                size={20}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => setModalType("exportOptions")}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Download size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Export All Data</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Backup as JSON or PDF
                  </p>
                </div>
              </div>
              <ChevronRight
                size={20}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <SettingsIcon className="text-primary" size={20} />
            <h2 className="text-lg font-bold">App Settings</h2>
          </div>
          <div className="bg-white/5 dark:bg-black/20 border border-primary/10 rounded-[2rem] overflow-hidden p-2 space-y-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditApiKey(state.user.customApiKey || "");
                setEditProvider((state.user.aiProvider as AiProvider) || "gemini");
                setEditKeys({
                  ...(state.user.apiKeys || {}),
                  gemini:
                    (state.user.apiKeys?.gemini as string) ||
                    state.user.customApiKey ||
                    "",
                });
                setModalType("aiSettings");
              }}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500">
                  <Bot size={20} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm">MKR Ai Features</span>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    AI Configuration
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setModalType("updateSettings")}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <RefreshCw size={20} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm">Update Settings</span>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Auto-updates
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                  <RefreshCw size={20} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm">App Animations</span>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Enable UI animations
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={state.user.animationsEnabled ?? true}
                  onChange={(e) => updateUser({ animationsEnabled: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
              </label>
            </motion.div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Github className="text-primary" size={20} />
            <h2 className="text-lg font-bold">Help & Feedback</h2>
          </div>
          <div className="bg-white/5 dark:bg-black/20 border border-primary/10 rounded-[2rem] overflow-hidden p-2 space-y-2">
            <motion.a
              whileTap={{ scale: 0.98 }}
              href={buildIssueUrl("bug")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-500">
                  <Bug size={20} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm">Report a Bug</span>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Report issue on GitHub
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </motion.a>
            <motion.a
              whileTap={{ scale: 0.98 }}
              href={buildIssueUrl("feature")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500">
                  <Lightbulb size={20} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm">Request a Feature</span>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Request a feature on GitHub
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </motion.a>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-4">
            <Coffee className="text-amber-500" size={20} />
            <h2 className="text-lg font-bold">Buy Me a Coffee</h2>
          </div>
          <motion.a
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            href="https://buymeacoffee.com/mkr_infinity"
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden rounded-[2.5rem] p-6 text-center border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-transparent shadow-[0_0_30px_rgba(245,158,11,0.12)] group block"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/15 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                <Coffee size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
                Caffeinate the Code
              </h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-400 mb-5 max-w-xs mx-auto leading-relaxed">
                Revision Master is built solo, late at night, with a lot of coffee.
                If the app saved you study time, a single cup keeps it ad-free,
                offline-first, and forever yours.
              </p>
              <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] uppercase text-xs tracking-widest">
                <Coffee size={14} />
                Buy me a coffee
              </div>
              <p className="mt-3 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                buymeacoffee.com/mkr_infinity
              </p>
            </div>
          </motion.a>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <RefreshCw className="text-primary" size={20} />
            <h2 className="text-lg font-bold">Danger Zone</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalType("restartOnboarding")}
              className="bg-white/5 dark:bg-black/20 border border-primary/10 rounded-[2rem] p-6 flex flex-col items-center text-center gap-3 hover:bg-purple-500/10 hover:border-purple-500/20 group transition-all"
            >
              <div className="size-12 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-500">
                <RefreshCw size={28} />
              </div>
              <div>
                <span className="font-bold text-sm">Restart Onboarding</span>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">
                  Replay welcome flow
                </p>
              </div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalType("resetStats")}
              className="bg-white/5 dark:bg-black/20 border border-primary/10 rounded-[2rem] p-6 flex flex-col items-center text-center gap-3 hover:bg-amber-500/10 hover:border-amber-500/20 group transition-all"
            >
              <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <RefreshCw size={28} />
              </div>
              <div>
                <span className="font-bold text-sm">Reset Stats</span>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">
                  Progress only
                </p>
              </div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalType("resetCards")}
              className="bg-white/5 dark:bg-black/20 border border-primary/10 rounded-[2rem] p-6 flex flex-col items-center text-center gap-3 hover:bg-orange-500/10 hover:border-orange-500/20 group transition-all sm:col-span-2"
            >
              <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Database size={28} />
              </div>
              <div>
                <span className="font-bold text-sm">Reset Cards</span>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">
                  Delete all data
                </p>
              </div>
            </motion.button>
          </div>
        </section>

        <footer className="text-center pt-8 space-y-2">
          <p className="text-sm font-medium flex items-center justify-center gap-1.5 opacity-60">
            Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> in India
          </p>
          <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">
            Revision Master • v{APP_VERSION} (Stable)
          </p>
        </footer>
      </main>

      {/* Toast Notification — floats above the update popup (z 300 > modal z 200)
          and sits at the TOP of the screen so it's always visible even when the
          update modal is open. */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed left-1/2 -translate-x-1/2 z-[300] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 whitespace-nowrap border border-white/10 backdrop-blur-md"
            style={{
              top: `calc(env(safe-area-inset-top, 0px) + 16px)`,
              backgroundColor: toast.type === 'success' ? '#10B981' : toast.type === 'error' ? '#EF4444' : '#3B82F6',
              color: 'white'
            }}
          >
            {toast.type === 'success' && <Star size={18} fill="currentColor" />}
            {toast.type === 'error' && <AlertTriangle size={18} />}
            {toast.type === 'info' && <Bot size={18} />}
            <span className="font-bold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restarting Overlay */}
      {isRestarting && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="size-16 border-4 border-primary border-t-transparent rounded-full mb-4"
          />
          <h2 className="text-xl font-bold text-primary">Applying Changes...</h2>
          <p className="text-sm text-slate-500 mt-2">Restarting application</p>
        </div>
      )}

      {/* Modals */}
      {modalType !== "none" && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center modal-backdrop"
          style={{
            paddingTop: `calc(env(safe-area-inset-top) + 12px)`,
            paddingBottom: `calc(env(safe-area-inset-bottom) + 110px)`,
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          <div className="bg-elevated border border-subtle rounded-3xl w-full max-w-md shadow-card-lg flex flex-col max-h-full overflow-hidden anime-aura">
            <div className="flex items-center justify-between p-4 border-b border-subtle shrink-0 bg-elevated">
              <h3 className="font-bold text-lg">
                {modalType === "resetStats" && "Reset Stats"}
                {modalType === "resetCards" && "Reset Cards"}
                {modalType === "restartOnboarding" && "Restart Onboarding"}
                {modalType === "editProfile" && "Edit Profile"}
                {modalType === "aiSettings" && "AI Settings"}
                {modalType === "exportOptions" && "Export"}
                {modalType === "updateSettings" && "Updates"}
              </h3>
              <button 
                onClick={() => setModalType("none")}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-secondary-fg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto no-scrollbar flex-1" style={{ WebkitOverflowScrolling: "touch" }}>
              {modalType === "resetStats" && (
                <div className="space-y-4">
                  <div className="size-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-4">
                    <RefreshCw size={24} />
                  </div>
                  <p className="text-center text-slate-700 dark:text-slate-400">
                    Are you sure you want to reset your stats? This will clear your streak, XP, and learning analytics.
                  </p>
                  <p className="text-center text-sm font-bold text-primary">
                    Your flashcards and formulas will NOT be deleted.
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleResetStats}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-amber-500 text-white"
                    >
                      Reset Stats
                    </button>
                  </div>
                </div>
              )}

              {modalType === "resetCards" && (
                <div className="space-y-4">
                  <div className="size-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mx-auto mb-4">
                    <Database size={24} />
                  </div>
                  <p className="text-center text-slate-700 dark:text-slate-400">
                    Are you sure you want to reset all your cards? This will delete all decks, flashcards, and formulas.
                  </p>
                  <p className="text-center text-sm font-bold text-red-500">
                    This action cannot be undone!
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleResetCards}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-orange-500 text-white"
                    >
                      Reset Cards
                    </button>
                  </div>
                </div>
              )}

              {modalType === "restartOnboarding" && (
                <div className="space-y-4">
                  <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-4">
                    <AlertTriangle size={24} />
                  </div>
                  <p className="text-center text-slate-700 dark:text-slate-400">
                    Are you sure you want to restart onboarding? This will wipe your profile, name, and exam target.
                  </p>
                  <p className="text-center text-sm font-bold text-primary">
                    Your flashcards and formulas will NOT be deleted.
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleRestartOnboarding}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-red-500 text-white"
                    >
                      Restart
                    </button>
                  </div>
                </div>
              )}

              {modalType === "editProfile" && (
                <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Exam</label>
                    <input 
                      type="text" 
                      value={editExam}
                      onChange={(e) => setEditExam(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Exam Date</label>
                    <input 
                      type="date" 
                      value={editExamDate}
                      onChange={(e) => setEditExamDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Motivation Quote</label>
                    <textarea 
                      value={editCustomQuote}
                      onChange={(e) => setEditCustomQuote(e.target.value)}
                      placeholder="Leave empty for random quotes"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none min-h-[80px] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Select Avatar</label>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {AVATARS.map((av) => (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          key={av.id}
                          onClick={() => setEditAvatar(av.src)}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${editAvatar === av.src ? "border-primary ring-2 ring-primary/20" : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"}`}
                        >
                          <img src={av.src} alt={av.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          {editAvatar === av.src && (
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                              <div className="bg-primary text-white p-1 rounded-full">
                                <Star size={12} fill="currentColor" />
                              </div>
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                    
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload from device</label>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                    <div className="flex items-center gap-3">
                      <div className="size-14 rounded-2xl overflow-hidden border border-subtle bg-surface-2 shrink-0">
                        <img src={editAvatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary/10 text-primary py-3 rounded-xl font-bold hover:bg-primary/20 transition-colors"
                      >
                        <Upload size={18} />
                        Choose photo
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleEditProfile}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-primary text-white"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              )}
              {modalType === "aiSettings" && (
                <div className="space-y-5">
                  <div className="rounded-2xl gradient-violet p-4 text-white shadow-glow">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-xl bg-white/15 flex items-center justify-center">
                        <Bot size={22} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-base leading-tight">MKR Ai</h4>
                        <p className="text-[11px] text-white/85 leading-snug">
                          Powers flashcard generation, mock tests, the chat assistant, and image covers. Toggle off to disable everything.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={state.user.aiEnabled !== false}
                          onChange={(e) => updateUser({ aiEnabled: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-white/25 rounded-full peer peer-checked:bg-white/90 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:bg-[var(--color-primary)]"></div>
                      </label>
                    </div>
                  </div>

                  <div className={state.user.aiEnabled === false ? "opacity-50 pointer-events-none select-none" : ""}>
                    <label className="block text-[11px] font-bold text-tertiary-fg uppercase tracking-widest mb-2">
                      Pick a provider — tap the dot to add a key
                    </label>
                    <p className="text-[11px] text-tertiary-fg mb-3 leading-snug">
                      The active provider is the one used for AI requests. Tap any glowing dot to reveal that provider's key field inline.
                    </p>

                    <div className="space-y-2">
                      {PROVIDERS.map((p) => {
                        const isActive = editProvider === p.id;
                        const value =
                          p.id === "gemini"
                            ? (editKeys.gemini ?? editApiKey ?? "")
                            : (editKeys[p.id] ?? "");
                        const hasKey = !!value;
                        const isOpen = showKeyFor === p.id;
                        return (
                          <div
                            key={p.id}
                            className={`rounded-2xl border-2 transition-all ${
                              isActive
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/8"
                                : "border-subtle bg-surface-1"
                            }`}
                          >
                            <div className="flex items-center gap-3 p-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setShowKeyFor(isOpen ? null : p.id)
                                }
                                className="relative shrink-0 size-10 rounded-full flex items-center justify-center transition-transform active:scale-90"
                                style={{
                                  background: `${p.color}22`,
                                  boxShadow: hasKey
                                    ? `0 0 0 2px ${p.color}, 0 0 14px ${p.color}80`
                                    : `0 0 0 1px ${p.color}55`,
                                }}
                                aria-label={`Toggle key for ${p.name}`}
                              >
                                <span
                                  className="size-3.5 rounded-full"
                                  style={{ background: p.color }}
                                />
                                {hasKey && (
                                  <span className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-[var(--color-mint)] text-black flex items-center justify-center border-2 border-elevated">
                                    <Check size={9} strokeWidth={3} />
                                  </span>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditProvider(p.id)}
                                className="flex-1 text-left min-w-0"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm truncate">{p.name}</span>
                                  {isActive && (
                                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-tertiary-fg leading-snug truncate">
                                  {p.hint}
                                </p>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setShowKeyFor(isOpen ? null : p.id)
                                }
                                className="shrink-0 size-8 rounded-lg flex items-center justify-center text-tertiary-fg hover:bg-surface-2"
                                aria-label={isOpen ? "Hide key field" : "Show key field"}
                              >
                                {isOpen ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-3 pb-3 pt-1 space-y-2 border-t border-subtle">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-tertiary-fg uppercase tracking-widest">
                                        API Key
                                      </span>
                                      <a
                                        href={p.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-bold text-[var(--color-primary)]"
                                      >
                                        Get key →
                                      </a>
                                    </div>
                                    <input
                                      type="text"
                                      value={value}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        setEditKeys((prev) => ({ ...prev, [p.id]: v }));
                                        if (p.id === "gemini") setEditApiKey(v);
                                      }}
                                      placeholder={
                                        p.id === "gemini"
                                          ? "Optional — built-in key works without one"
                                          : "Paste API key"
                                      }
                                      className="w-full bg-app border border-subtle rounded-xl py-2.5 px-3 text-sm font-mono focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none"
                                      autoFocus
                                    />
                                    {hasKey && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditKeys((prev) => ({
                                            ...prev,
                                            [p.id]: "",
                                          }));
                                          if (p.id === "gemini") setEditApiKey("");
                                        }}
                                        className="text-[11px] font-bold text-rose-500"
                                      >
                                        Remove key
                                      </button>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-surface-2 border border-subtle p-3">
                    <p className="text-[11px] text-secondary-fg leading-relaxed">
                      Keys live on this device only. If a request fails we'll show a friendly message — no silent errors.
                    </p>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-3 rounded-2xl font-bold bg-surface-2 text-secondary-fg active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        updateUser({
                          aiProvider: editProvider,
                          apiKeys: editKeys as any,
                          customApiKey: editKeys.gemini ?? editApiKey,
                        });
                        setModalType("none");
                        showToast("AI settings saved.", "success");
                      }}
                      className="flex-1 py-3 rounded-2xl font-bold gradient-violet text-white shadow-glow active:scale-[0.98]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
              {modalType === "updateSettings" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">Automatic Update Checks</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Check for updates on app startup</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={state.user.autoUpdateEnabled !== false}
                        onChange={(e) => updateUser({ autoUpdateEnabled: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-primary/10">
                    <button 
                      onClick={handleCheckUpdate}
                      disabled={checkingUpdate}
                      className="w-full py-3 rounded-xl font-bold bg-primary/10 text-primary flex items-center justify-center gap-2 hover:bg-primary/20 transition-all disabled:opacity-50"
                    >
                      <RefreshCw size={18} className={checkingUpdate ? "animate-spin" : ""} />
                      {checkingUpdate ? "Checking..." : "Check for Updates Now"}
                    </button>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="w-full py-2.5 rounded-xl font-bold bg-primary text-white"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
              {modalType === "exportOptions" && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Choose how you want to export your data. JSON is best for backups, while PDF is great for studying.
                  </p>
                  
                  <button 
                    onClick={() => {
                      handleExport();
                      setModalType("none");
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Database size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm">Export as JSON</p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                          Full backup of all data
                        </p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      startExport(state.decks, "All_Decks");
                      setModalType("none");
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm">Export as PDF</p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                          Printable study material
                        </p>
                      </div>
                    </div>
                  </button>

                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="w-full py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Settings;
