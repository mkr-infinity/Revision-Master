import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Sparkles, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Browser } from '@capacitor/browser';
import { compareVersions } from 'compare-versions';

const CURRENT_VERSION = "2.0.0"; // Current app version
const GITHUB_REPO = "mkr-infinity/Revision-Master";
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
// Public, always-current "latest release" page — used as the download redirect target.
const GITHUB_LATEST_RELEASE_URL = `https://github.com/${GITHUB_REPO}/releases/latest`;

export default function UpdateNotifier() {
  const { state } = useAppContext();
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  const lastCheckTime = useRef<number>(0);
  const lastCheckResult = useRef<{hasUpdate: boolean, latestVersion: string | null} | null>(null);

  const AUTO_CHECK_INTERVAL = 172800000; // 48 hours in ms
  const LS_KEY_TIME = "rm_update_last_check_time";
  const LS_KEY_RESULT = "rm_update_last_check_result";

  const checkUpdate = async (isManual = false) => {
    const dispatchResult = (hasUpdate: boolean, latestVersion: string | null, error: string | null) => {
      window.dispatchEvent(new CustomEvent('update-check-result', {
        detail: { hasUpdate, latestVersion, error, isManual }
      }));
    };

    if (isChecking) return;

    // For auto checks: use localStorage-persisted timestamp so the 48h window
    // survives app restarts. For manual checks: always hit the network (after 1.5s delay).
    if (!isManual) {
      try {
        const storedTime = parseInt(localStorage.getItem(LS_KEY_TIME) || "0", 10);
        const storedResult = JSON.parse(localStorage.getItem(LS_KEY_RESULT) || "null");
        if (storedResult && Date.now() - storedTime < AUTO_CHECK_INTERVAL) {
          lastCheckTime.current = storedTime;
          lastCheckResult.current = storedResult;
          dispatchResult(storedResult.hasUpdate, storedResult.latestVersion, null);
          if (storedResult.hasUpdate) setIsVisible(true);
          return;
        }
      } catch { /* ignore parse errors */ }
    }

    // In-session cache for manual re-checks within same session (5 min)
    if (isManual && Date.now() - lastCheckTime.current < 300000 && lastCheckResult.current) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      dispatchResult(lastCheckResult.current.hasUpdate, lastCheckResult.current.latestVersion, null);
      if (lastCheckResult.current.hasUpdate) setIsVisible(true);
      return;
    }

    setIsChecking(true);
    
    if (isManual) {
      // Ensure "Checking..." state is visible for at least 1.5s
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    try {
      const response = await fetch(GITHUB_API_URL);
      
      if (response.status === 404) {
        // No releases found yet
        lastCheckTime.current = Date.now();
        lastCheckResult.current = { hasUpdate: false, latestVersion: null };
        dispatchResult(false, null, null);
        return;
      }

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data || !data.tag_name) {
        lastCheckTime.current = Date.now();
        lastCheckResult.current = { hasUpdate: false, latestVersion: null };
        dispatchResult(false, null, null);
        return;
      }

      const latestVersion = data.tag_name.replace(/^v/, ''); // Remove 'v' prefix if present
      const currentVersion = CURRENT_VERSION.replace(/^v/, '');

      const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;
      
      const now = Date.now();
      lastCheckTime.current = now;
      lastCheckResult.current = { hasUpdate, latestVersion };
      try {
        localStorage.setItem(LS_KEY_TIME, String(now));
        localStorage.setItem(LS_KEY_RESULT, JSON.stringify({ hasUpdate, latestVersion }));
      } catch { /* storage quota */ }
      
      // Dispatch result for manual checks in Settings
      dispatchResult(hasUpdate, latestVersion, null);

      if (hasUpdate) {
        // Always send the user to the GitHub release page so they can grab the
        // latest APK directly from the official repo, regardless of asset name.
        setUpdateInfo({
          version: data.tag_name,
          releaseNotes: data.body || "New update available with bug fixes and improvements.",
          downloadUrl: data.html_url || GITHUB_LATEST_RELEASE_URL,
          htmlUrl: data.html_url || GITHUB_LATEST_RELEASE_URL,
          hasApk: !!data.assets?.some((a: any) => a.name?.endsWith('.apk')),
        });
        setIsVisible(true);
      }
    } catch (error) {
      console.error("Failed to check for updates", error);
      
      // Dispatch error for manual checks in Settings
      dispatchResult(false, null, error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Listen for manual checks - always active
    const handleManualCheck = () => checkUpdate(true);
    window.addEventListener('check-for-updates', handleManualCheck);
    
    return () => {
      window.removeEventListener('check-for-updates', handleManualCheck);
    };
  }, []);

  useEffect(() => {
    if (state.user.autoUpdateEnabled === false) return;

    // Check if snoozed in the last 7 days
    if (state.user.lastUpdateSnoozedAt) {
      const snoozedDate = new Date(state.user.lastUpdateSnoozedAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - snoozedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) return;
    }

    // Run automatically when app starts
    checkUpdate(false);
  }, [state.user.autoUpdateEnabled, state.user.lastUpdateSnoozedAt]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const openExternal = async (url: string) => {
    try {
      // Use Capacitor's in-app system browser when running on Android.
      await Browser.open({ url });
    } catch {
      // Fallback for the web build / dev preview.
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadUpdate = async () => {
    const url = updateInfo?.downloadUrl || GITHUB_LATEST_RELEASE_URL;
    await openExternal(url);
    setIsVisible(false);
  };

  const handleViewRelease = async () => {
    const url = updateInfo?.htmlUrl || GITHUB_LATEST_RELEASE_URL;
    await openExternal(url);
    setIsVisible(false);
  };

  if (!isVisible || !updateInfo) return null;

  return (
    <AnimatePresence>
      {isVisible && updateInfo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-20">
                <Sparkles size={120} />
              </div>
              
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Update Available</h3>
                  <p className="text-white/80 text-sm font-medium">Version {updateInfo.version}</p>
                </div>
              </div>
              
              <p className="text-white/90 font-medium text-lg mt-4 relative z-10 leading-snug">
                A new version of Revision Master is available.
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6 max-h-32 overflow-y-auto no-scrollbar">
                <p className="text-sm text-slate-700 dark:text-slate-400 whitespace-pre-line">
                  {updateInfo.releaseNotes}
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadUpdate}
                  className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                >
                  <Download size={18} />
                  Download Update
                </motion.button>
                
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewRelease}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ExternalLink size={18} />
                  View Release on GitHub
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
