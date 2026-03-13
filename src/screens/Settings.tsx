import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Smartphone
} from "lucide-react";
import { useAppContext, Theme } from "../context/AppContext";
import appIcon1 from "../assets/app-icon-1.svg";
import appIcon2 from "../assets/app-icon-2.svg";
import appIcon3 from "../assets/app-icon-3.svg";
import appIcon4 from "../assets/app-icon-4.svg";

const appIcons = [
  { id: "icon1", src: appIcon1, name: "Default" },
  { id: "icon2", src: appIcon2, name: "Book" },
  { id: "icon3", src: appIcon3, name: "Target" },
  { id: "icon4", src: appIcon4, name: "Mastery" },
];

const themes: { id: Theme; name: string; colors: string }[] = [
  { id: "light", name: "Light", colors: "bg-white border-slate-200" },
  { id: "dark", name: "Dark", colors: "bg-slate-900 border-primary" },
  { id: "green", name: "Green", colors: "bg-[#0a1a0a] border-emerald-500" },
  { id: "neon", name: "Neon", colors: "bg-black border-fuchsia-500" },
  { id: "blue", name: "Blue", colors: "bg-blue-900 border-blue-400" },
  { id: "purple", name: "Purple", colors: "bg-purple-900 border-fuchsia-400" },
  { id: "oled", name: "OLED", colors: "bg-black border-white/20" },
  { id: "sunset", name: "Sunset", colors: "bg-orange-900 border-rose-500" },
  { id: "slate-gold", name: "Slate Gold", colors: "bg-slate-900 border-amber-400" },
  { id: "midnight-blue", name: "Midnight", colors: "bg-sky-900 border-sky-400" },
  { id: "cherry-blossom", name: "Cherry", colors: "bg-fuchsia-900 border-pink-400" },
  { id: "hacker-green", name: "Hacker", colors: "bg-black border-green-500" },
];

import { registerPlugin } from '@capacitor/core';

interface UpdatePlugin {
  checkForUpdates(options: { isManual: boolean }): Promise<void>;
}

const UpdatePlugin = registerPlugin<UpdatePlugin>('UpdatePlugin');

const Settings = () => {
  const navigate = useNavigate();
  const { state, updateUser, resetStats, resetOnboarding, resetCards, importData } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modalType, setModalType] = useState<"none" | "resetStats" | "restartOnboarding" | "editProfile" | "aiSettings" | "resetCards" | "updateSettings">("none");
  const [editName, setEditName] = useState(state.user.name);
  const [editExam, setEditExam] = useState(state.user.examTarget);
  const [editAvatar, setEditAvatar] = useState(state.user.avatar);
  const [editExamDate, setEditExamDate] = useState(state.user.examDate || "");
  const [editCustomQuote, setEditCustomQuote] = useState(state.user.customQuote || "");
  const [editApiKey, setEditApiKey] = useState(state.user.customApiKey || "");
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const [isAppIconExpanded, setIsAppIconExpanded] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const handleAppIconChange = (iconSrc: string) => {
    updateUser({ appIcon: iconSrc });
    setIsRestarting(true);
    
    // Update the favicon dynamically for the web view
    const link: HTMLLinkElement = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = iconSrc;
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

  const handleCheckUpdate = async () => {
    setCheckingUpdate(true);
    try {
      if ((window as any).Capacitor?.isNativePlatform()) {
        await UpdatePlugin.checkForUpdates({ isManual: true });
      } else {
        // Fallback for web/preview
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Randomly simulate an update (20% chance)
        const hasUpdate = Math.random() < 0.2;
        
        if (hasUpdate) {
          alert("Update Available! A new version is ready for download.");
        } else {
          const randomMessage = noUpdateMessages[Math.floor(Math.random() * noUpdateMessages.length)];
          alert(randomMessage);
        }
      }
    } catch (error) {
      console.error("Update check failed", error);
      alert("Failed to check for updates. Please check your internet connection.");
    } finally {
      setCheckingUpdate(false);
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
      className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 pb-12"
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
            onClick={() => setIsAppIconExpanded(!isAppIconExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Smartphone size={20} />
              </div>
              <h2 className="text-lg font-bold">App Icon</h2>
            </div>
            <motion.div
              animate={{ rotate: isAppIconExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="text-slate-400 group-hover:text-primary transition-colors" size={20} />
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={false}
            animate={{ 
              height: isAppIconExpanded ? "auto" : "0px", 
              opacity: isAppIconExpanded ? 1 : 0,
              marginTop: isAppIconExpanded ? 8 : 0
            }}
            className="overflow-hidden px-2"
          >
            <div className="p-2 grid grid-cols-4 gap-4">
              {appIcons.map((icon) => (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  key={icon.id}
                  onClick={() => handleAppIconChange(icon.src)}
                  className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${state.user.appIcon === icon.src ? "scale-105" : "opacity-70 hover:opacity-100"}`}
                >
                  <div className={`w-12 h-12 rounded-xl overflow-hidden shadow-lg ${state.user.appIcon === icon.src ? "ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark shadow-primary/40" : ""}`}>
                    <img src={icon.src} alt={icon.name} className="w-full h-full object-cover" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${state.user.appIcon === icon.src ? "text-primary" : "text-slate-500"}`}>{icon.name}</span>
                </motion.div>
              ))}
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
              onClick={handleExport}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Download size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Export All Data</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Create JSON backup
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
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-6 max-w-xs mx-auto leading-relaxed">
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
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Are you sure you want to reset your stats? This will clear your streak, XP, and learning analytics.
                  </p>
                  <p className="text-center text-sm font-bold text-primary">
                    Your flashcards and formulas will NOT be deleted.
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Are you sure you want to reset all your cards? This will delete all decks, flashcards, and formulas.
                  </p>
                  <p className="text-center text-sm font-bold text-red-500">
                    This action cannot be undone!
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Are you sure you want to restart onboarding? This will wipe your profile, name, and exam target.
                  </p>
                  <p className="text-center text-sm font-bold text-primary">
                    Your flashcards and formulas will NOT be deleted.
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avatar Image</label>
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full border border-primary/20 overflow-hidden shrink-0">
                        <img src={editAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <input 
                        type="text" 
                        value={editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        placeholder="Or paste image URL"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Settings;
