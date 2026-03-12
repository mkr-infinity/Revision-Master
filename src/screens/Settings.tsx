import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Bot
} from "lucide-react";
import { useAppContext, Theme } from "../context/AppContext";

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
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 pb-12">
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
            <button 
              onClick={() => {
                setEditName(state.user.name);
                setEditExam(state.user.examTarget);
                setEditAvatar(state.user.avatar);
                setModalType("editProfile");
              }}
              className="absolute -top-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-background-dark hover:scale-110 transition-transform"
            >
              <Edit2 size={14} />
            </button>
          </div>
          <h2 className="text-2xl font-bold">{state.user.name || "Scholar"}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {state.user.examTarget || "No Exam Selected"}
          </p>
        </div>

        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Palette className="text-primary" size={20} />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">
            {themes.map((t) => (
              <div
                key={t.id}
                onClick={() => updateUser({ theme: t.id })}
                className="flex-none w-32 group cursor-pointer"
              >
                <div
                  className={`aspect-[3/4] rounded-xl mb-2 border-2 ${t.colors} ${state.user.theme === t.id ? "ring-2 ring-primary/50 border-primary" : "opacity-70 group-hover:opacity-100"}`}
                ></div>
                <p
                  className={`text-center text-sm font-medium ${state.user.theme === t.id ? "text-primary" : "opacity-70"}`}
                >
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Database className="text-primary" size={20} />
            <h2 className="text-lg font-semibold">Data Management</h2>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl overflow-hidden divide-y divide-primary/10">
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              onChange={handleImport} 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <Upload size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium">Import All Data</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Restore from .json backup
                  </p>
                </div>
              </div>
              <ChevronRight
                size={20}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button 
              onClick={handleExport}
              className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <Download size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium">Export All Data</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create a JSON backup file
                  </p>
                </div>
              </div>
              <ChevronRight
                size={20}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <SettingsIcon className="text-primary" size={20} />
            <h2 className="text-lg font-semibold">App Settings</h2>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl overflow-hidden divide-y divide-primary/10">
            <button
              onClick={() => {
                setEditApiKey(state.user.customApiKey || "");
                setModalType("aiSettings");
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500">
                  <Bot size={18} />
                </div>
                <div className="text-left">
                  <span className="font-medium">MKR Ai Features</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure API key and toggle AI
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={() => setModalType("updateSettings")}
              className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <RefreshCw size={18} />
                </div>
                <div className="text-left">
                  <span className="font-medium">Update Settings</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage automatic updates
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <RefreshCw className="text-primary" size={20} />
            <h2 className="text-lg font-semibold">Danger Zone</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setModalType("resetStats")}
              className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center text-center gap-2 hover:bg-amber-500/10 hover:border-amber-500/20 group transition-all"
            >
              <RefreshCw className="text-amber-500" size={28} />
              <span className="font-medium">Reset Stats</span>
              <p className="text-xs text-slate-500">
                Clears activity progress only
              </p>
            </button>
            <button
              onClick={() => setModalType("resetCards")}
              className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center text-center gap-2 hover:bg-orange-500/10 hover:border-orange-500/20 group transition-all"
            >
              <Database className="text-orange-500" size={28} />
              <span className="font-medium">Reset Cards</span>
              <p className="text-xs text-slate-500">
                Deletes all decks and cards
              </p>
            </button>
            <button
              onClick={() => setModalType("restartOnboarding")}
              className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center text-center gap-2 hover:bg-red-500/10 hover:border-red-500/20 group transition-all"
            >
              <AlertTriangle className="text-red-500" size={28} />
              <span className="font-medium">Restart Onboarding</span>
              <p className="text-xs text-slate-500">
                Wipe everything and start fresh
              </p>
            </button>
          </div>
        </section>

        <footer className="text-center pt-8 space-y-2">
          <p className="text-sm font-medium flex items-center justify-center gap-1.5 opacity-60">
            Made with <span className="text-red-500 text-base">♥</span> in India
          </p>
          <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">
            Revision Master • v1.0.0 (Stable)
          </p>
        </footer>
      </main>

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
    </div>
  );
};

export default Settings;
