import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Settings as SettingsIcon,
  Star,
  Upload,
  Download,
  Code,
  Edit2,
  X,
  Bot,
  Sparkles,
  Heart,
  Coffee,
  Smartphone,
  LayoutGrid,
  FileText,
  List,
  Info,
  Bug,
  Lightbulb,
  Eye,
  EyeOff,
  Check,
  ImageIcon,
  Trash2,
  SunMedium,
  Ban,
  ScrollText,
  RotateCcw,
} from "lucide-react";
import { useAppContext, Theme, AVATARS, THEMES, normalizeTheme } from "../context/AppContext";
import { usePdfExport } from "../components/PdfExportProvider";
import { PROVIDERS, AiProvider } from "../utils/ai";
import { Capacitor } from "@capacitor/core";

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
  const customBgInputRef = useRef<HTMLInputElement>(null);

  const [bgUploading, setBgUploading] = useState(false);

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const MAX_W = 1920;
          const scale = img.width > MAX_W ? MAX_W / img.width : 1;
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = reject;
        img.src = ev.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleCustomBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBgUploading(true);
    try {
      const compressed = await compressImage(file);
      updateUser({ customBgImage: compressed, disableBgImage: false });
      showToast("Background image saved!", "success");
    } catch {
      showToast("Failed to load image", "error");
    } finally {
      setBgUploading(false);
      if (customBgInputRef.current) customBgInputRef.current.value = "";
    }
  };

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
  const [isRestarting, setIsRestarting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const [navSectionOpen, setNavSectionOpen] = useState(false);
  const [cardsSectionOpen, setCardsSectionOpen] = useState(false);

  const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // When navigated here from the AI error modal ("Open AI settings"),
  // automatically open the AI Settings popup.
  useEffect(() => {
    const navState = location.state as { openModal?: string } | null;
    if (navState?.openModal === "aiSettings") {
      setEditApiKey(state.user.customApiKey || "");
      setEditProvider((state.user.aiProvider as AiProvider) || "gemini");
      setEditKeys({ ...(state.user.apiKeys || {}), gemini: (state.user.apiKeys?.gemini as string) || state.user.customApiKey || "" });
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

  const handleExport = async () => {
    const dataStr = JSON.stringify(state, null, 2);
    const exportFileDefaultName = "revision_master_backup.json";

    if (Capacitor.isNativePlatform()) {
      try {
        const { Directory, Filesystem, Encoding } = await import("@capacitor/filesystem");
        const { Share } = await import("@capacitor/share");

        // Write file to cache directory
        const result = await Filesystem.writeFile({
          path: exportFileDefaultName,
          data: dataStr,
          directory: Directory.Cache,
          encoding: Encoding.UTF8
        });

        // Share the file
        await Share.share({
          title: "Export Backup",
          text: "Here is my Revision Master backup file.",
          url: result.uri,
          dialogTitle: "Save or Share Backup"
        });
      } catch (error) {
        showToast("Failed to export natively.", "error");
        console.error("Native export error:", error);
      }
    } else {
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    }
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

  const rangeStyle = (value: number, min: number, max: number): React.CSSProperties => {
    const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    return {
      background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${pct}%, var(--bg-surface-3) ${pct}%, var(--bg-surface-3) 100%)`
    };
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="relative shrink-0 w-12 h-7 rounded-full transition-all duration-200"
      style={{
        background: checked
          ? "var(--color-primary)"
          : "var(--bg-surface-3)",
        boxShadow: checked ? "0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent)" : "none",
      }}
    >
      <span
        className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-md transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.25)" }}
      />
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="font-display text-primary-fg"
    >
      <header
        className="sticky top-0 z-50 px-4 pb-2.5"
        style={{ paddingTop: `calc(env(safe-area-inset-top) + 6px)` }}
      >
        <div className="flex items-center gap-3 backdrop-blur-xl bg-elevated/60 border border-white/[0.08] shadow-md shadow-black/10 rounded-[1.35rem] px-4 py-2">
          <div className="size-8.5 rounded-xl flex items-center justify-center gradient-theme-hero shadow-glow">
            <SettingsIcon className="text-white" size={18} />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-primary-fg">Settings</h1>
        </div>
      </header>

      <main className="px-4 space-y-6 pt-5 pb-32">
        {/* ── PROFILE CARD ── */}
        <div
          className="relative overflow-hidden rounded-3xl p-5 border"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "color-mix(in srgb, var(--color-primary) 22%, var(--border-subtle))",
            boxShadow: "0 2px 16px -4px color-mix(in srgb, var(--color-primary) 12%, transparent)",
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl" style={{ background: "linear-gradient(180deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 40%, transparent) 100%)" }} />
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "var(--theme-pattern, none)", backgroundSize: "var(--theme-pattern-size, auto)" }} />
          <div className="relative z-10 flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="size-16 rounded-2xl overflow-hidden shadow-lg" style={{ outline: "2px solid color-mix(in srgb, var(--color-primary) 30%, transparent)" }}>
                <img src={state.user.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 font-black text-[10px] px-1.5 py-0.5 rounded-full shadow" style={{ background: "var(--color-primary)", color: "#fff" }}>
                Lv{state.user.level}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg text-primary-fg truncate leading-tight">{state.user.name || "Scholar"}</h2>
              <p className="text-sm text-secondary-fg truncate mt-0.5">{state.user.examTarget || "No exam selected"}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setEditName(state.user.name);
                setEditExam(state.user.examTarget);
                setEditExamDate(state.user.examDate || "");
                setEditCustomQuote(state.user.customQuote || "");
                setEditAvatar(state.user.avatar);
                setModalType("editProfile");
              }}
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 font-bold text-sm border shadow-md transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 92%, #ffffff) 0%, color-mix(in srgb, var(--color-primary) 70%, var(--color-coral)) 100%)",
                color: "#fff",
                borderColor: "color-mix(in srgb, var(--color-primary) 35%, var(--border-strong))",
                boxShadow: "0 10px 24px -10px color-mix(in srgb, var(--color-primary) 60%, transparent)",
              }}
            >
              <Edit2 size={15} />
              <span>Edit Profile</span>
            </motion.button>
          </div>
        </div>

        {/* ── APPEARANCE ── */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase px-1">Appearance</p>
          <div className="bg-elevated rounded-2xl border border-subtle overflow-hidden shadow-card">
            {/* Theme picker */}
            <div className="p-4">
              <p className="text-sm font-bold text-primary-fg mb-3">Theme</p>
              {(["light", "dark"] as const).map((mode) => (
                <div key={mode} className="mb-4 last:mb-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary-fg mb-2">
                    {mode === "light" ? "Light themes" : "Dark themes"}
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory no-scrollbar">
                    {THEMES.filter((t) => t.mode === mode).map((t) => {
                      const active = normalizeTheme(state.user.theme) === t.id;
                      return (
                        <motion.button
                          whileTap={{ scale: 0.93 }}
                          key={t.id}
                          onClick={() => updateUser({ theme: t.id })}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all snap-start shrink-0 w-[160px] ${active ? "border-primary shadow-glow" : "border-transparent hover:border-primary/30"}`}
                        >
                          <div className="aspect-[3/2] flex flex-col p-1.5 gap-1" style={{ background: t.swatch }}>
                            <div className="h-1.5 rounded-full w-1/2" style={{ background: t.accent, opacity: 0.9 }} />
                            <div className="flex-1 rounded" style={{ background: t.surface }} />
                            <div className="flex gap-1">
                              <div className="h-1.5 flex-1 rounded-full" style={{ background: t.accent }} />
                              <div className="h-1.5 w-3 rounded-full" style={{ background: t.surface }} />
                            </div>
                          </div>
                          <div className="px-1.5 py-1 bg-elevated">
                            <p className={`text-[9px] font-bold uppercase tracking-wide truncate ${active ? "text-primary" : "text-tertiary-fg"}`}>{t.name}</p>
                          </div>
                          {active && (
                            <div className="absolute top-1 right-1 size-4 rounded-full bg-primary text-white flex items-center justify-center">
                              <Check size={9} strokeWidth={3} />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {/* Theme Aura toggle */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--color-primary) 15%, var(--bg-surface-2))" }}>
                  <Sparkles size={15} style={{ color: "var(--color-primary)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-fg">Theme Aura</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">Glowing energy around UI elements</p>
                </div>
              </div>
              <Toggle
                checked={state.user.auraEnabled !== false}
                onChange={() => updateUser({ auraEnabled: !(state.user.auraEnabled !== false) })}
              />
            </div>
            {/* System Font toggle */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <Code size={15} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-fg">System Font</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">Use your device's default font</p>
                </div>
              </div>
              <Toggle
                checked={!!state.user.useSystemFont}
                onChange={() => updateUser({ useSystemFont: !state.user.useSystemFont })}
              />
            </div>
          </div>
        </div>

        {/* ── CUSTOM BACKGROUND ── */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase px-1">Custom Background</p>
          <div className="bg-elevated rounded-2xl border border-subtle overflow-hidden shadow-card">

            {/* Upload row */}
            <div className="px-4 py-4 border-b border-subtle">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-8 rounded-xl bg-fuchsia-500/15 flex items-center justify-center">
                  <ImageIcon size={15} className="text-fuchsia-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-fg">Home Background</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">Upload any photo to replace the anime wallpaper</p>
                </div>
              </div>

              {state.user.customBgImage ? (
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="size-16 rounded-xl overflow-hidden shrink-0 ring-2 ring-fuchsia-500/30">
                    <img
                      src={state.user.customBgImage}
                      alt="Custom background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary-fg mb-2">Custom image active</p>
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => customBgInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-colors"
                        style={{ background: "color-mix(in srgb, var(--color-primary) 12%, transparent)", color: "var(--color-primary)", borderColor: "color-mix(in srgb, var(--color-primary) 30%, transparent)" }}
                      >
                        <Upload size={12} /> Change
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { updateUser({ customBgImage: undefined }); showToast("Background removed", "info"); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border border-red-500/30 transition-colors"
                        style={{ background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)" }}
                      >
                        <Trash2 size={12} /> Remove
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => customBgInputRef.current?.click()}
                  disabled={bgUploading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-dashed transition-colors"
                  style={{ borderColor: "color-mix(in srgb, var(--color-primary) 35%, transparent)", color: "var(--color-primary)", background: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
                >
                  {bgUploading ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <Upload size={15} />
                  )}
                  {bgUploading ? "Processing..." : "Choose image (JPG · PNG · WebP)"}
                </motion.button>
              )}

              <input
                ref={customBgInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleCustomBgUpload}
              />
            </div>

            {/* Visibility slider — only shown when image is set */}
            {state.user.customBgImage && (
              <div className="px-4 pt-3.5 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-amber-500/15 flex items-center justify-center">
                      <SunMedium size={15} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-fg">Image Visibility</p>
                      <p className="text-[11px] text-tertiary-fg leading-tight">Increase to show more of your photo</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full border"
                    style={{ color: "var(--color-primary)", background: "color-mix(in srgb, var(--color-primary) 10%, transparent)", borderColor: "color-mix(in srgb, var(--color-primary) 25%, transparent)" }}>
                    {state.user.customBgOpacity ?? 40}%
                  </span>
                </div>
                <input
                  type="range" min="0" max="100" step="5"
                  value={state.user.customBgOpacity ?? 40}
                  onChange={(e) => updateUser({ customBgOpacity: parseInt(e.target.value) })}
                  className="w-full cursor-pointer"
                  style={rangeStyle(state.user.customBgOpacity ?? 40, 0, 100)}
                />
                <div className="flex justify-between text-[10px] text-tertiary-fg mt-1.5 px-0.5">
                  <span>More overlay</span>
                  <span>More image</span>
                </div>
              </div>
            )}

            <div className="px-4 py-4 border-t border-subtle">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded-xl bg-slate-500/15 flex items-center justify-center shrink-0">
                    <Ban size={15} className="text-secondary-fg" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary-fg">Disable background image</p>
                    <p className="text-[11px] text-tertiary-fg leading-tight">Use the theme color only, no wallpaper</p>
                  </div>
                </div>
                <Toggle
                  checked={!!state.user.disableBgImage}
                  onChange={() => updateUser({ disableBgImage: !state.user.disableBgImage })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── NAVIGATION STYLE ── standalone section for style picker */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase px-1">Navigation Style</p>
          <div className="bg-elevated rounded-2xl border border-subtle overflow-hidden shadow-card">
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-8 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <Smartphone size={15} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-fg">Bar Style</p>
                  <p className="text-[11px] text-tertiary-fg">Choose your navigation bar look</p>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory no-scrollbar">
                {([
                  { id: "floating-pill", label: "Floating Pill", variant: "pill" },
                  { id: "attached", label: "Attached Bar", variant: "bar" },
                  { id: "glow", label: "Glow", variant: "glow" },
                  { id: "segments", label: "Segments", variant: "segments" },
                  { id: "minimal", label: "Minimal", variant: "minimal" },
                  { id: "compact", label: "Compact", variant: "compact" },
                  { id: "floating-glass", label: "Glass", variant: "glass" },
                ] as const).map(({ id, label, variant }) => {
                  const active = (state.user.navStyle || "floating-pill") === id;
                  return (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      key={id}
                      onClick={() => updateUser({ navStyle: id })}
                      className="relative rounded-2xl overflow-hidden border-2 transition-all snap-start shrink-0 w-[170px]"
                      style={active
                        ? { borderColor: "var(--color-primary)", boxShadow: "0 0 0 4px color-mix(in srgb, var(--color-primary) 15%, transparent)" }
                        : { borderColor: "var(--border-subtle)" }}
                    >
                      {/* Mini preview */}
                      <div className="w-full aspect-[5/3] relative overflow-hidden flex items-end justify-center pb-1.5"
                        style={{ background: "var(--bg-surface-2)" }}>
                        <div className="absolute top-2 left-2 right-2 flex flex-col gap-1">
                          <div className="h-1 rounded-full w-3/4" style={{ background: "var(--bg-surface-3)", opacity: 0.8 }} />
                          <div className="h-1 rounded-full w-1/2" style={{ background: "var(--bg-surface-3)", opacity: 0.5 }} />
                        </div>
                        {variant === "pill" && (
                          <div className="w-4/5 h-4 rounded-full flex items-center justify-around px-2 shadow-sm"
                            style={{ background: "var(--theme-nav-bg, var(--bg-elevated))", border: "1px solid var(--theme-nav-border, var(--border-subtle))" }}>
                            {[0,1,2,3].map(i => (
                              <div key={i} className={i === 0 ? "h-2 px-2 rounded-full" : "size-1.5 rounded-full"}
                                style={{ background: i === 0 ? "var(--color-primary)" : "var(--bg-surface-3)" }} />
                            ))}
                          </div>
                        )}
                        {variant === "bar" && (
                          <div className="w-full h-5 flex items-center justify-around px-2"
                            style={{ background: "var(--theme-nav-bg, var(--bg-elevated))", borderTop: "1px solid var(--theme-nav-border, var(--border-subtle))" }}>
                            {[0,1,2,3].map(i => (
                              <div key={i} className="flex flex-col items-center gap-0.5">
                                <div className="size-1.5 rounded-full" style={{ background: i === 0 ? "var(--color-primary)" : "var(--bg-surface-3)" }} />
                                {i === 0 && <div className="h-0.5 w-3 rounded-full" style={{ background: "var(--color-primary)" }} />}
                              </div>
                            ))}
                          </div>
                        )}
                        {variant === "glow" && (
                          <div className="w-4/5 h-5 rounded-2xl flex items-center justify-around px-2"
                            style={{ background: "color-mix(in srgb, var(--bg-elevated) 55%, transparent)", border: "1px solid color-mix(in srgb, var(--border-subtle) 50%, transparent)", backdropFilter: "blur(8px)" }}>
                            {[0,1,2,3].map(i => (
                              <div key={i} className="flex flex-col items-center gap-0.5">
                                <div className="size-1.5 rounded-full" style={{
                                  background: i === 0 ? "var(--color-primary)" : "var(--bg-surface-3)",
                                  boxShadow: i === 0 ? "0 0 4px 2px color-mix(in srgb, var(--color-primary) 60%, transparent)" : "none",
                                }} />
                                {i === 0 && <div className="size-0.5 rounded-full" style={{ background: "var(--color-primary)", boxShadow: "0 0 3px 1px color-mix(in srgb, var(--color-primary) 80%, transparent)" }} />}
                              </div>
                            ))}
                          </div>
                        )}
                        {variant === "segments" && (
                          <div className="w-4/5 h-5 rounded-xl flex items-center overflow-hidden"
                            style={{ background: "var(--theme-nav-bg, var(--bg-elevated))", border: "1px solid var(--theme-nav-border, var(--border-subtle))" }}>
                            {[0,1,2,3].map(i => (
                              <div key={i} className="flex-1 h-full flex items-center justify-center"
                                style={{ background: i === 0 ? "var(--color-primary)" : "transparent" }}>
                                <div className="size-1 rounded-full" style={{ background: i === 0 ? "#fff" : "var(--bg-surface-3)" }} />
                              </div>
                            ))}
                          </div>
                        )}
                        {variant === "minimal" && (
                          <div className="w-full h-4 flex items-center justify-center gap-5">
                            {[0,1,2].map(i => (
                              <div key={i} className="flex flex-col items-center gap-0.5">
                                <div className="size-1.5 rounded-full" style={{ background: i === 0 ? "var(--color-primary)" : "var(--bg-surface-3)" }} />
                                <div className="h-0.5 w-2 rounded-full" style={{ background: i === 0 ? "var(--color-primary)" : "transparent" }} />
                              </div>
                            ))}
                          </div>
                        )}
                        {variant === "compact" && (
                          <div className="w-3/5 h-6 rounded-full flex items-center justify-between px-3"
                            style={{ background: "var(--theme-nav-bg, var(--bg-elevated))", border: "1px solid var(--theme-nav-border, var(--border-subtle))" }}>
                            <div className="size-2 rounded-full" style={{ background: "var(--color-primary)" }} />
                            <div className="size-1.5 rounded-full" style={{ background: "var(--bg-surface-3)" }} />
                            <div className="size-1.5 rounded-full" style={{ background: "var(--bg-surface-3)" }} />
                          </div>
                        )}
                        {variant === "glass" && (
                          <div className="w-4/5 h-5 rounded-2xl flex items-center justify-around px-2"
                            style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(12px)" }}>
                            {[0,1,2,3].map(i => (
                              <div key={i} className="size-1.5 rounded-full"
                                style={{ background: i === 0 ? "#fff" : "rgba(255,255,255,0.6)", boxShadow: i === 0 ? "0 0 6px rgba(255,255,255,0.6)" : "none" }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="px-2 py-1.5 flex items-center justify-between"
                        style={{ background: "var(--bg-elevated)" }}>
                        <p className="text-[9px] font-bold uppercase tracking-wide"
                          style={{ color: active ? "var(--color-primary)" : "var(--text-tertiary)" }}>{label}</p>
                        {active && (
                          <div className="size-3.5 rounded-full flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
                            <Check size={8} strokeWidth={3} className="text-white" />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── NAVIGATION (collapsible) ── */}
        <div className="space-y-1.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setNavSectionOpen(o => !o)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all"
            style={{
              background: navSectionOpen
                ? "color-mix(in srgb, var(--color-primary) 8%, var(--bg-elevated))"
                : "var(--bg-elevated)",
              borderColor: navSectionOpen
                ? "color-mix(in srgb, var(--color-primary) 35%, transparent)"
                : "var(--border-subtle)",
              boxShadow: navSectionOpen
                ? "0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent)"
                : "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div className="size-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "color-mix(in srgb, var(--color-primary) 14%, var(--bg-surface-2))" }}>
              <LayoutGrid size={16} style={{ color: "var(--color-primary)" }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-primary-fg leading-tight">Navigation Options</p>
              <p className="text-[11px] text-tertiary-fg leading-tight mt-0.5">Position · Height · Icons</p>
            </div>
            <motion.div animate={{ rotate: navSectionOpen ? 180 : 0 }} transition={{ duration: 0.22 }} className="shrink-0">
              <ChevronDown size={16} className="text-tertiary-fg" />
            </motion.div>
          </motion.button>
          <AnimatePresence initial={false}>
            {navSectionOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="bg-elevated rounded-2xl border border-subtle shadow-card" style={{ overflow: "visible" }}>
                  {/* Position: Bottom */}
                  <div className="px-4 py-3.5 border-b border-subtle">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
                        <LayoutGrid size={15} className="text-violet-500" />
                      </div>
                      <p className="text-sm font-semibold text-primary-fg">Position</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => updateUser({ navOrientation: "horizontal" })}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all border"
                        style={true
                          ? { background: "var(--color-primary)", color: "#fff", borderColor: "transparent", boxShadow: "0 4px 12px -3px var(--color-primary-glow)" }
                          : { background: "var(--bg-surface-2)", color: "var(--text-tertiary)", borderColor: "var(--border-subtle)" }}
                      >
                        <div className="w-4 h-1 bg-current rounded-full" />
                        Bottom
                      </motion.button>
                    </div>
                  </div>

                  {/* Bar Height */}
                  <div className="px-4 pt-3.5 pb-5 border-b border-subtle">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
                          <LayoutGrid size={15} className="text-violet-500" />
                        </div>
                        <p className="text-sm font-semibold text-primary-fg">Bar Height</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full border"
                        style={{ color: "var(--color-primary)", background: "color-mix(in srgb, var(--color-primary) 10%, transparent)", borderColor: "color-mix(in srgb, var(--color-primary) 25%, transparent)" }}>
                        {state.user.navBarHeight || 68}px
                      </span>
                    </div>
                    <input type="range" min="44" max="96" value={state.user.navBarHeight || 68}
                      onChange={(e) => updateUser({ navBarHeight: parseInt(e.target.value) })}
                      className="w-full cursor-pointer"
                      style={rangeStyle(state.user.navBarHeight || 68, 44, 96)} />
                  </div>

                  {/* Icon Size */}
                  <div className="px-4 pt-3.5 pb-5 border-b border-subtle">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-teal-500/15 flex items-center justify-center">
                          <Star size={15} className="text-teal-500" />
                        </div>
                        <p className="text-sm font-semibold text-primary-fg">Icon Size</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full border"
                        style={{ color: "var(--color-primary)", background: "color-mix(in srgb, var(--color-primary) 10%, transparent)", borderColor: "color-mix(in srgb, var(--color-primary) 25%, transparent)" }}>
                        {state.user.navBarIconSize || 22}px
                      </span>
                    </div>
                    <input type="range" min="16" max="30" value={state.user.navBarIconSize || 22}
                      onChange={(e) => updateUser({ navBarIconSize: parseInt(e.target.value) })}
                      className="w-full cursor-pointer"
                      style={rangeStyle(state.user.navBarIconSize || 22, 16, 30)} />
                  </div>

                  {/* Hide Labels */}
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-subtle">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-orange-500/15 flex items-center justify-center">
                        <Eye size={15} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-fg">Hide Labels</p>
                        <p className="text-[11px] text-tertiary-fg leading-tight">Icons only mode</p>
                      </div>
                    </div>
                    <Toggle
                      checked={!!state.user.navBarHideLabels}
                      onChange={() => updateUser({ navBarHideLabels: !state.user.navBarHideLabels })}
                    />
                  </div>

                  {/* Reset nav defaults */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateUser({ navOrientation: "horizontal", navBarHeight: 68, navBarIconSize: 22, navBarHideLabels: false })}
                    className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors"
                    style={{ color: "var(--text-tertiary)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface-2)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="size-8 rounded-xl flex items-center justify-center" style={{ background: "var(--bg-surface-2)" }}>
                      <RefreshCw size={14} />
                    </div>
                    <span className="text-sm font-semibold">Reset to defaults</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CARDS & DECKS (collapsible) ── */}
        <div className="space-y-1.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setCardsSectionOpen(o => !o)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all"
            style={{
              background: cardsSectionOpen
                ? "color-mix(in srgb, var(--color-primary) 8%, var(--bg-elevated))"
                : "var(--bg-elevated)",
              borderColor: cardsSectionOpen
                ? "color-mix(in srgb, var(--color-primary) 35%, transparent)"
                : "var(--border-subtle)",
              boxShadow: cardsSectionOpen
                ? "0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent)"
                : "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div className="size-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "color-mix(in srgb, var(--color-primary) 14%, var(--bg-surface-2))" }}>
              <FileText size={16} style={{ color: "var(--color-primary)" }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-primary-fg leading-tight">Cards & Decks</p>
              <p className="text-[11px] text-tertiary-fg leading-tight mt-0.5">Layout · Size · Display</p>
            </div>
            <motion.div animate={{ rotate: cardsSectionOpen ? 180 : 0 }} transition={{ duration: 0.22 }} className="shrink-0">
              <ChevronDown size={16} className="text-tertiary-fg" />
            </motion.div>
          </motion.button>
          <AnimatePresence initial={false}>
            {cardsSectionOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="bg-elevated rounded-2xl border border-subtle shadow-card" style={{ overflow: "visible" }}>
                  {/* Layout */}
                  <div className="px-4 py-3.5 border-b border-subtle">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-8 rounded-xl bg-pink-500/15 flex items-center justify-center">
                        <LayoutGrid size={15} className="text-pink-500" />
                      </div>
                      <p className="text-sm font-semibold text-primary-fg">Layout Style</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => updateUser({ decksLayout: "grid" })}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all border"
                        style={state.user.decksLayout !== "list"
                          ? { background: "var(--color-primary)", color: "#fff", borderColor: "transparent", boxShadow: "0 4px 12px -3px var(--color-primary-glow)" }
                          : { background: "var(--bg-surface-2)", color: "var(--text-tertiary)", borderColor: "var(--border-subtle)" }}
                      >
                        <LayoutGrid size={15} /> Grid
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => updateUser({ decksLayout: "list" })}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all border"
                        style={state.user.decksLayout === "list"
                          ? { background: "var(--color-primary)", color: "#fff", borderColor: "transparent", boxShadow: "0 4px 12px -3px var(--color-primary-glow)" }
                          : { background: "var(--bg-surface-2)", color: "var(--text-tertiary)", borderColor: "var(--border-subtle)" }}
                      >
                        <List size={15} /> List
                      </motion.button>
                    </div>
                  </div>

                  {/* Card Size */}
                  <div className="px-4 pt-3.5 pb-5 border-b border-subtle">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-amber-500/15 flex items-center justify-center">
                          <FileText size={15} className="text-amber-500" />
                        </div>
                        <p className="text-sm font-semibold text-primary-fg">Card Size</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full border"
                        style={{ color: "var(--color-primary)", background: "color-mix(in srgb, var(--color-primary) 10%, transparent)", borderColor: "color-mix(in srgb, var(--color-primary) 25%, transparent)" }}>
                        {Math.round((state.user.decksSize || 1) * 100)}%
                      </span>
                    </div>
                    <input type="range" min="0.5" max="1.5" step="0.1" value={state.user.decksSize || 1}
                      onChange={(e) => updateUser({ decksSize: parseFloat(e.target.value) })}
                      className="w-full cursor-pointer"
                      style={rangeStyle(state.user.decksSize || 1, 0.5, 1.5)} />
                  </div>

                  {/* Reset decks defaults */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateUser({ decksLayout: "grid", decksSize: 1 })}
                    className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors"
                    style={{ color: "var(--text-tertiary)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface-2)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="size-8 rounded-xl flex items-center justify-center" style={{ background: "var(--bg-surface-2)" }}>
                      <RefreshCw size={14} />
                    </div>
                    <span className="text-sm font-semibold">Reset to defaults</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── AI & FEATURES ── */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase px-1">AI & Features</p>
          <div className="bg-elevated rounded-2xl border border-subtle overflow-hidden shadow-card">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-purple-500/15 flex items-center justify-center">
                  <Bot size={15} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-fg">AI Features</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">Generation, chat & covers</p>
                </div>
              </div>
              <Toggle
                checked={state.user.aiEnabled !== false}
                onChange={() => updateUser({ aiEnabled: !(state.user.aiEnabled !== false) })}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditApiKey(state.user.customApiKey || "");
                setEditProvider((state.user.aiProvider as AiProvider) || "gemini");
                setEditKeys({ ...(state.user.apiKeys || {}), gemini: (state.user.apiKeys?.gemini as string) || state.user.customApiKey || "" });
                setModalType("aiSettings");
              }}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-surface-2/50 active:bg-surface-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
                  <Sparkles size={15} className="text-violet-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-primary-fg">Provider & API Keys</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight capitalize">
                    {state.user.aiProvider || "Gemini"} ·{" "}
                    {(state.user.apiKeys?.[(state.user.aiProvider || "gemini") as AiProvider] || state.user.customApiKey) ? "Key configured" : "No key set"}
                  </p>
                </div>
              </div>
              <ChevronRight size={17} className="text-tertiary-fg" />
            </motion.button>
          </div>
        </div>

        {/* ── DATA ── */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase px-1">Data</p>
          <div className="bg-elevated rounded-2xl border border-subtle overflow-hidden shadow-card">
            <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-surface-2/50 active:bg-surface-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-green-500/15 flex items-center justify-center">
                  <Upload size={15} className="text-green-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-primary-fg">Import Data</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">Restore from JSON backup</p>
                </div>
              </div>
              <ChevronRight size={17} className="text-tertiary-fg" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setModalType("exportOptions")}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-surface-2/50 active:bg-surface-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <Download size={15} className="text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-primary-fg">Export Data</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">Backup as JSON or PDF</p>
                </div>
              </div>
              <ChevronRight size={17} className="text-tertiary-fg" />
            </motion.button>
          </div>
        </div>

        {/* ── RECYCLE BIN ── */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase px-1">Recycle Bin</p>
          <div className="bg-elevated rounded-2xl border border-subtle overflow-hidden shadow-card">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <RotateCcw size={15} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-fg">Enable Recycle Bin</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">Move deleted items to bin instead of removing permanently</p>
                </div>
              </div>
              <Toggle
                checked={state.user.recycleBinEnabled !== false}
                onChange={() => updateUser({ recycleBinEnabled: !(state.user.recycleBinEnabled !== false) })}
              />
            </div>
            {state.user.recycleBinEnabled !== false && (
              <>
                <div className="border-t border-subtle flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-orange-500/15 flex items-center justify-center">
                      <Trash2 size={15} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-fg">Auto-delete after</p>
                      <p className="text-[11px] text-tertiary-fg leading-tight">Days before bin items are permanently removed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={state.user.recycleBinRetentionDays ?? 15}
                      onChange={e => {
                        const v = parseInt(e.target.value);
                        if (!isNaN(v) && v >= 1 && v <= 365) updateUser({ recycleBinRetentionDays: v });
                      }}
                      className="w-14 text-center text-sm font-semibold bg-surface-2 border border-subtle rounded-lg px-2 py-1 text-primary-fg focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <span className="text-xs text-tertiary-fg">days</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/recycle-bin")}
                  className="border-t border-subtle w-full flex items-center justify-between px-4 py-3.5 hover:bg-surface-2/50 active:bg-surface-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-red-500/15 flex items-center justify-center">
                      <Trash2 size={15} className="text-red-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-primary-fg">Open Recycle Bin</p>
                      <p className="text-[11px] text-tertiary-fg leading-tight">
                        {(state.recycleBin || []).length > 0
                          ? `${(state.recycleBin || []).length} item${(state.recycleBin || []).length !== 1 ? "s" : ""} in bin`
                          : "Bin is empty"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(state.recycleBin || []).length > 0 && (
                      <span className="text-xs font-bold text-white bg-red-500 rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {(state.recycleBin || []).length}
                      </span>
                    )}
                    <ChevronRight size={17} className="text-tertiary-fg" />
                  </div>
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* ── APP ── */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase px-1">App</p>
          <div className="bg-elevated rounded-2xl border border-subtle overflow-hidden shadow-card">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <Sparkles size={15} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-fg">Animations</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">UI motion & transitions</p>
                </div>
              </div>
              <Toggle
                checked={state.user.animationsEnabled ?? true}
                onChange={() => updateUser({ animationsEnabled: !(state.user.animationsEnabled ?? true) })}
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <RefreshCw size={15} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-fg">Auto-update Checks</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">Check for updates on startup</p>
                </div>
              </div>
              <Toggle
                checked={state.user.autoUpdateEnabled !== false}
                onChange={() => updateUser({ autoUpdateEnabled: !(state.user.autoUpdateEnabled !== false) })}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckUpdate}
              disabled={checkingUpdate}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-surface-2/50 active:bg-surface-2 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-teal-500/15 flex items-center justify-center">
                  <RefreshCw size={15} className={`text-teal-500 ${checkingUpdate ? "animate-spin" : ""}`} />
                </div>
                <p className="text-sm font-semibold text-primary-fg">
                  {checkingUpdate ? "Checking for updates..." : "Check for Updates"}
                </p>
              </div>
              <ChevronRight size={17} className="text-tertiary-fg" />
            </motion.button>
          </div>
        </div>

        {/* ── ABOUT & SUPPORT ── */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-widest text-tertiary-fg uppercase px-1">About & Support</p>

          {/* About & Changelog — two equal cards side by side */}
          <div className="grid grid-cols-2 gap-2.5">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/about", { state: { scrollToTop: true } })}
              className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3 text-left border"
              style={{
                background: "color-mix(in srgb, var(--color-primary) 8%, var(--bg-elevated))",
                borderColor: "color-mix(in srgb, var(--color-primary) 22%, var(--border-subtle))",
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none"
                style={{ background: "linear-gradient(to left, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent)" }} />
              <div className="size-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 60%, #000))" }}>
                <Info size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-primary-fg leading-snug">About</p>
                <p className="text-[10px] text-tertiary-fg mt-0.5 leading-tight">Developer · Links</p>
              </div>
              <div className="absolute top-3 right-3 size-5 rounded-full flex items-center justify-center"
                style={{ background: "color-mix(in srgb, var(--color-primary) 14%, transparent)" }}>
                <ChevronRight size={11} style={{ color: "var(--color-primary)" }} />
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/changelog", { state: { collapseAll: true } })}
              className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3 text-left border"
              style={{
                background: "color-mix(in srgb, var(--color-primary) 6%, var(--bg-elevated))",
                borderColor: "color-mix(in srgb, var(--color-primary) 18%, var(--border-subtle))",
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none"
                style={{ background: "linear-gradient(to left, color-mix(in srgb, var(--color-primary) 6%, transparent), transparent)" }} />
              <div className="size-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 80%, #6366f1), color-mix(in srgb, var(--color-primary) 50%, #a855f7))" }}>
                <ScrollText size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-primary-fg leading-snug">Changelog</p>
                <p className="text-[10px] text-tertiary-fg mt-0.5 leading-tight">v{APP_VERSION} · What's new</p>
              </div>
              <div className="absolute top-3 right-3 size-5 rounded-full flex items-center justify-center"
                style={{ background: "color-mix(in srgb, var(--color-primary) 14%, transparent)" }}>
                <ChevronRight size={11} style={{ color: "var(--color-primary)" }} />
              </div>
            </motion.button>
          </div>

          {/* Support row — 2 capsule cards side by side */}
          <div className="grid grid-cols-2 gap-2.5">
            <motion.a
              whileTap={{ scale: 0.96 }}
              href={buildIssueUrl("bug")}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-2.5 border"
              style={{ background: "color-mix(in srgb, #ef4444 6%, var(--bg-elevated))", borderColor: "color-mix(in srgb, #ef4444 20%, var(--border-subtle))" }}
            >
              <div className="size-9 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <Bug size={17} className="text-rose-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary-fg leading-tight">Report Bug</p>
                <p className="text-[10px] text-tertiary-fg mt-0.5 leading-tight">Open a GitHub issue</p>
              </div>
              <div className="absolute top-3 right-3 size-5 rounded-full bg-rose-500/10 flex items-center justify-center">
                <ChevronRight size={11} className="text-rose-500" />
              </div>
            </motion.a>

            <motion.a
              whileTap={{ scale: 0.96 }}
              href={buildIssueUrl("feature")}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-2.5 border"
              style={{ background: "color-mix(in srgb, #f59e0b 6%, var(--bg-elevated))", borderColor: "color-mix(in srgb, #f59e0b 20%, var(--border-subtle))" }}
            >
              <div className="size-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                <Lightbulb size={17} className="text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary-fg leading-tight">Request Feature</p>
                <p className="text-[10px] text-tertiary-fg mt-0.5 leading-tight">Suggest an idea</p>
              </div>
              <div className="absolute top-3 right-3 size-5 rounded-full bg-amber-500/10 flex items-center justify-center">
                <ChevronRight size={11} className="text-amber-500" />
              </div>
            </motion.a>
          </div>

          {/* Buy Me a Coffee — standout warm capsule */}
          <motion.a
            whileTap={{ scale: 0.97 }}
            href="https://buymeacoffee.com/mkr_infinity"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center gap-4 rounded-[1.6rem] p-4.5 border relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, color-mix(in srgb, #f59e0b 16%, var(--bg-elevated)) 0%, color-mix(in srgb, #fb923c 10%, var(--bg-elevated)) 55%, color-mix(in srgb, #f97316 6%, var(--bg-elevated)) 100%)",
              borderColor: "color-mix(in srgb, #f59e0b 32%, var(--border-subtle))",
              boxShadow: "0 18px 40px -20px rgba(245,158,11,0.65), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none opacity-80"
              style={{ background: "radial-gradient(ellipse at right center, rgba(251,146,60,0.18), transparent 72%)" }} />
            <div className="relative size-12 rounded-[1.15rem] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(145deg, #f59e0b, #fb923c 60%, #f97316)", boxShadow: "0 10px 22px -10px rgba(245,158,11,0.8)" }}>
              <Coffee size={18} className="text-white" strokeWidth={2.4} />
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <p className="font-black text-[15px] text-primary-fg leading-tight">Buy me a coffee</p>
              <p className="text-[11px] text-tertiary-fg mt-0.5 leading-snug">Support the developer and keep updates flowing</p>
            </div>
            <div className="shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em]"
              style={{ background: "linear-gradient(135deg, #f59e0b, #fb923c)", color: "#fff", boxShadow: "0 8px 16px -8px rgba(245,158,11,0.85)" }}>
              Support
            </div>
          </motion.a>
        </div>

        {/* ── DANGER ZONE ── */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-widest text-rose-500 uppercase px-1">Danger Zone</p>
          <div className="bg-elevated rounded-2xl border border-rose-500/20 overflow-hidden shadow-card">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setModalType("restartOnboarding")}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-rose-500/5 active:bg-rose-500/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-purple-500/15 flex items-center justify-center">
                  <RefreshCw size={15} className="text-purple-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-primary-fg">Restart Onboarding</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">Resets profile only, cards are safe</p>
                </div>
              </div>
              <ChevronRight size={17} className="text-tertiary-fg" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setModalType("resetStats")}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-rose-500/5 active:bg-rose-500/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <RefreshCw size={15} className="text-amber-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-primary-fg">Reset Stats</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">Clears streak, XP & analytics</p>
                </div>
              </div>
              <ChevronRight size={17} className="text-tertiary-fg" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setModalType("resetCards")}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-rose-500/5 active:bg-rose-500/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <Database size={15} className="text-red-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-rose-500">Delete All Cards</p>
                  <p className="text-[11px] text-tertiary-fg leading-tight">Permanently deletes all decks & cards</p>
                </div>
              </div>
              <ChevronRight size={17} className="text-rose-500/60" />
            </motion.button>
          </div>
        </div>

        <footer className="text-center pt-4 pb-2 space-y-1.5">
          <p className="text-sm font-medium flex items-center justify-center gap-1.5 text-tertiary-fg">
            Made with <Heart size={13} className="text-rose-500 fill-rose-500" /> in India
          </p>
          <p className="text-[10px] uppercase tracking-widest text-tertiary-fg/60 font-bold">
            Revision Master · v{APP_VERSION}
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
          className="fixed inset-0 z-[200] flex items-start sm:items-center justify-center modal-backdrop"
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
                                : "border-subtle bg-elevated/95 backdrop-blur-md"
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
                                onClick={() => {
                                  setEditProvider(p.id);
                                  setShowKeyFor(p.id);
                                }}
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
                                      onFocus={() => setEditProvider(p.id)}
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
                        const keyToSave = editProvider === "gemini"
                          ? (editKeys.gemini ?? editApiKey)
                          : (editKeys[editProvider] ?? "");
                        console.log("[AI_SETTINGS] Saving AI Settings:", {
                          provider: editProvider,
                          hasGeminiKey: !!editKeys.gemini,
                          hasCustomKey: !!editApiKey,
                          finalKeyToSave: keyToSave ? `${keyToSave.substring(0, 10)}...` : "EMPTY",
                          editKeys: Object.keys(editKeys).reduce((acc, k) => ({ ...acc, [k]: !!editKeys[k as keyof typeof editKeys] }), {}),
                        });
                        updateUser({
                          aiProvider: editProvider,
                          apiKeys: editKeys as any,
                          customApiKey: editProvider === "gemini" ? keyToSave : (state.user.customApiKey || ""),
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
