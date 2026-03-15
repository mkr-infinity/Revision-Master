import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Info
} from "lucide-react";
import { useAppContext, Theme, AVATARS, APP_LOGOS } from "../context/AppContext";
import { exportDecksToPDF } from "../utils/pdfExport";
const themes: { id: Theme; name: string; colors: string }[] = [
  { id: "light", name: "Light", colors: "bg-white border-slate-200" },
  { id: "dark", name: "Dark", colors: "bg-slate-900 border-primary" },
  { id: "oled", name: "OLED", colors: "bg-black border-white/20" },
  { id: "slate-gold", name: "Slate Gold", colors: "bg-slate-900 border-amber-400" },
  { id: "hacker-green", name: "Hacker", colors: "bg-black border-green-500" },
  { id: "graphite", name: "Graphite", colors: "bg-[#1c1c1e] border-blue-500" },
  { id: "material-dark", name: "Material", colors: "bg-[#121212] border-purple-400" },
  { id: "soft-light", name: "Soft Light", colors: "bg-[#f8f9fa] border-indigo-400" },
  { id: "sepia-light", name: "Sepia", colors: "bg-[#f4ecd8] border-amber-700" },
];

const Settings = () => {
  const navigate = useNavigate();
  const { state, updateUser, resetStats, resetOnboarding, resetCards, importData } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modalType, setModalType] = useState<"none" | "resetStats" | "restartOnboarding" | "editProfile" | "aiSettings" | "resetCards" | "updateSettings" | "exportOptions">("none");
  const [editName, setEditName] = useState(state.user.name);
  const [editExam, setEditExam] = useState(state.user.examTarget);
  const [editAvatar, setEditAvatar] = useState(state.user.avatar);
  const [editExamDate, setEditExamDate] = useState(state.user.examDate || "");
  const [editCustomQuote, setEditCustomQuote] = useState(state.user.customQuote || "");
  const [editApiKey, setEditApiKey] = useState(state.user.customApiKey || "");
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const [isAppLogoExpanded, setIsAppLogoExpanded] = useState(false);
  const [isDecksExpanded, setIsDecksExpanded] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAppLogoChange = (logoSrc: string) => {
    updateUser({ appLogo: logoSrc });
    setIsRestarting(true);
    
    // Update the favicon dynamically for the web view
    const link: HTMLLinkElement = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = logoSrc;
    document.getElementsByTagName('head')[0].appendChild(link);

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const noUpdateMessages = [
    "Already newest version",
    "Developer needs support, updating support him",
    "Developer is sleeping, update later",
    "More toast messages",
    "MKR Ai is optimizing the code, wait..."
  ];

  useEffect(() => {
    const handleUpdateResult = (e: any) => {
      const { hasUpdate, latestVersion, error } = e.detail;
      setCheckingUpdate(false);
      
      if (error) {
        showToast(`Update check failed: ${error}`, "error");
      } else if (hasUpdate) {
        showToast(`New version available: ${latestVersion}`, "info");
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
    navigate("/splash");
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
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center gap-3 border-b border-primary/10">
        <div className="size-10 rounded-lg bg-gradient-to-tr from-primary via-blue-500 to-teal-400 flex items-center justify-center shadow-lg shadow-primary/20">
          <SettingsIcon className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
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
                  Version 1.0.0
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
            <div className="p-2 grid grid-cols-3 sm:grid-cols-4 gap-3">
              {themes.map((t) => (
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  key={t.id}
                  onClick={() => updateUser({ theme: t.id })}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer transition-all border-2 ${state.user.theme === t.id ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--color-primary),0.3)]" : "border-transparent hover:bg-primary/5"}`}
                >
                  <div className={`w-full aspect-square rounded-xl mb-2 border-2 ${t.colors}`}></div>
                  <p className={`text-[10px] font-black uppercase tracking-wider ${state.user.theme === t.id ? "text-primary" : "text-slate-500 dark:text-slate-400"}`}>
                    {t.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="bg-white/5 dark:bg-black/20 rounded-[2.5rem] p-2 border border-primary/10 shadow-sm">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between p-4 cursor-pointer group rounded-[2rem] hover:bg-primary/5 transition-colors"
            onClick={() => setIsAppLogoExpanded(!isAppLogoExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Smartphone size={20} />
              </div>
              <h2 className="text-lg font-bold">App Logo</h2>
            </div>
            <motion.div
              animate={{ rotate: isAppLogoExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="text-slate-400 group-hover:text-primary transition-colors" size={20} />
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={false}
            animate={{ 
              height: isAppLogoExpanded ? "auto" : "0px", 
              opacity: isAppLogoExpanded ? 1 : 0,
              marginTop: isAppLogoExpanded ? 8 : 0
            }}
            className="overflow-hidden px-2"
          >
            <div className="p-4 mb-2 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">💡 Pro Tip</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                This setting changes the logo <b>inside</b> the app.
              </p>
            </div>
            <div className="p-2 grid grid-cols-4 gap-4">
              {APP_LOGOS.map((logo) => (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  key={logo.id}
                  onClick={() => handleAppLogoChange(logo.src)}
                  className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${state.user.appLogo === logo.src ? "scale-105" : "opacity-70 hover:opacity-100"}`}
                >
                  <div className={`w-12 h-12 rounded-xl overflow-hidden shadow-lg ${state.user.appLogo === logo.src ? "ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark shadow-primary/40" : ""}`}>
                    <img src={logo.src} alt={logo.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${state.user.appLogo === logo.src ? "text-primary" : "text-slate-500"}`}>{logo.name}</span>
                </motion.div>
              ))}
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
                <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Sparkles size={20} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm">Splash Screen</span>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Startup animation
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={state.user.showSplashScreen ?? true}
                  onChange={(e) => updateUser({ showSplashScreen: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
              </label>
            </motion.div>
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
          <div className="flex items-center gap-2 px-4">
            <Heart className="text-rose-500" size={20} />
            <h2 className="text-lg font-bold">Support My Work</h2>
          </div>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-[2.5rem] p-8 text-center border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-transparent shadow-[0_0_30px_rgba(244,63,94,0.1)] group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/30 mb-4 group-hover:scale-110 transition-transform">
                <Heart size={28} className="text-white fill-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Fuel the Development</h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
                Revision Master is built with passion. Your support keeps the servers running and the app ad-free!
              </p>
              <motion.a 
                whileTap={{ scale: 0.95 }}
                href="https://supportmkr.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black py-3 px-10 rounded-full transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] uppercase text-xs tracking-widest"
              >
                Support Me
              </motion.a>
            </div>
          </motion.div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <RefreshCw className="text-primary" size={20} />
            <h2 className="text-lg font-bold">Danger Zone</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="bg-white/5 dark:bg-black/20 border border-primary/10 rounded-[2rem] p-6 flex flex-col items-center text-center gap-3 hover:bg-orange-500/10 hover:border-orange-500/20 group transition-all"
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
            Revision Master • v1.0.0 (Stable)
          </p>
        </footer>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 whitespace-nowrap border border-white/10 backdrop-blur-md"
            style={{ 
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background-light dark:bg-background-dark border border-primary/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-primary/10">
              <h3 className="font-bold text-lg">
                {modalType === "resetStats" && "Reset Stats"}
                {modalType === "resetCards" && "Reset Cards"}
                {modalType === "restartOnboarding" && "Restart Onboarding"}
                {modalType === "editProfile" && "Edit Profile"}
              </h3>
              <button 
                onClick={() => setModalType("none")}
                className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
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
                    
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Avatar URL</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        value={editAvatar.startsWith('data:') ? '' : editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        placeholder="https://example.com/avatar.png"
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                      />
                      <input 
                        type="file" 
                        id="avatar-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        className="bg-primary/10 text-primary p-3 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Upload size={20} />
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
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">Enable MKR Ai Features</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Turn on/off all AI capabilities</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={state.user.aiEnabled !== false}
                        onChange={(e) => updateUser({ aiEnabled: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Custom API Key (Optional)</label>
                    <input 
                      type="password" 
                      value={editApiKey}
                      onChange={(e) => setEditApiKey(e.target.value)}
                      placeholder="Leave blank to use default API key"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      If provided, this Gemini API key will be used for all MKR Ai features.
                    </p>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        updateUser({ customApiKey: editApiKey });
                        setModalType("none");
                      }}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-primary text-white"
                    >
                      Save Settings
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
                      exportDecksToPDF(state.decks, "All_Decks");
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
