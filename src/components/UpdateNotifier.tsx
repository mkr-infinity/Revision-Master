import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { registerPlugin } from '@capacitor/core';

interface UpdatePlugin {
  checkForUpdates(options: { isManual: boolean }): Promise<void>;
}

const UpdatePlugin = registerPlugin<UpdatePlugin>('UpdatePlugin');

const CURRENT_VERSION = "1.0.0"; // Current app version
const GITHUB_REPO_URL = "https://github.com/mkr_infinity/Revision-Master";

export default function UpdateNotifier() {
  const { state, updateUser } = useAppContext();
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

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

    const checkUpdate = async () => {
      // If on native Android, use the native UpdateManager
      if ((window as any).Capacitor?.isNativePlatform()) {
        try {
          await UpdatePlugin.checkForUpdates({ isManual: false });
        } catch (error) {
          console.error("Native update check failed", error);
        }
        return;
      }

      try {
        // Web fallback logic...
        const mockData = {
          version: "1.0.1",
          releaseNotes: "New UI improvements and bigger cards!",
          downloadUrl: `${GITHUB_REPO_URL}/releases/latest`
        };

        if (mockData.version !== CURRENT_VERSION) {
          setUpdateInfo(mockData);
          setTimeout(() => setIsVisible(true), 3000);
        }
      } catch (error) {
        console.error("Failed to check for updates", error);
      }
    };

    checkUpdate();
  }, [state.user.autoUpdateEnabled, state.user.lastUpdateSnoozedAt]);

  const handleSnooze = () => {
    setIsVisible(false);
    updateUser({ lastUpdateSnoozedAt: new Date().toISOString() });
  };

  if (!isVisible || !updateInfo) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Sparkles size={48} />
        </div>
        
        <button 
          onClick={handleSnooze}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <h4 className="font-bold">Update Available! (v{updateInfo.version})</h4>
        </div>
        
        <p className="text-xs text-white/90 mb-2 leading-relaxed">
          {updateInfo.releaseNotes}
        </p>
        
        <p className="text-[10px] text-white/70 mb-4 italic">
          Note: Go to Revision Master repo from releases section, download latest updates.
        </p>
        
        <a 
          href={updateInfo.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-white text-primary font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
        >
          Download Now <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
