import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import App from "./App.tsx";
import "./index.css";

let isPreferencesReady = false;
let pendingPreferencesSaves: Promise<void>[] = [];

async function bootstrapApp() {
  if (Capacitor.isNativePlatform()) {
    try {
      console.log("[BOOTSTRAP] Loading Capacitor Preferences...");
      // 1. Load all existing preferences from native storage into window.localStorage
      const { keys } = await Preferences.keys();
      console.log(`[BOOTSTRAP] Found ${keys.length} keys in Preferences`, keys);
      
      for (const key of keys) {
        const { value } = await Preferences.get({ key });
        if (value !== null) {
          window.localStorage.setItem(key, value);
          if (key === "revisionMasterState") {
            try {
              const parsed = JSON.parse(value);
              console.log("[BOOTSTRAP] Restored state with API keys:", {
                hasCustomKey: !!parsed.user?.customApiKey,
                hasApiKeys: !!Object.keys(parsed.user?.apiKeys || {}).length,
              });
            } catch (e) {
              console.error("[BOOTSTRAP] Failed to parse state:", e);
            }
          }
        }
      }
      
      // Mark that we've successfully loaded preferences
      isPreferencesReady = true;
      console.log("[BOOTSTRAP] Preferences loaded successfully");

      // 2. Override localStorage to sync all future writes to native Preferences
      const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
      const originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);
      const originalClear = window.localStorage.clear.bind(window.localStorage);

      window.localStorage.setItem = function (key: string, value: string) {
        originalSetItem(key, value);
        // Track this promise so we can wait for it before app closes
        const promise = Preferences.set({ key, value })
          .then(() => {
            if (key === "revisionMasterState") {
              console.log("[PREFERENCES] Preferences.set() succeeded for app state");
            }
          })
          .catch((err) => {
            console.error(`[PREFERENCES] Preferences.set() failed for key "${key}":`, err);
          });
        pendingPreferencesSaves.push(promise);
        // Clean up the promise from the array after it completes
        promise.finally(() => {
          const idx = pendingPreferencesSaves.indexOf(promise);
          if (idx > -1) pendingPreferencesSaves.splice(idx, 1);
        });
      };

      window.localStorage.removeItem = function (key: string) {
        originalRemoveItem(key);
        const promise = Preferences.remove({ key })
          .catch((err) => {
            console.error(`Failed to remove key "${key}" from native Preferences:`, err);
          });
        pendingPreferencesSaves.push(promise);
        promise.finally(() => {
          const idx = pendingPreferencesSaves.indexOf(promise);
          if (idx > -1) pendingPreferencesSaves.splice(idx, 1);
        });
      };

      window.localStorage.clear = function () {
        originalClear();
        const promise = Preferences.clear()
          .catch((err) => {
            console.error("Failed to clear native Preferences:", err);
          });
        pendingPreferencesSaves.push(promise);
        promise.finally(() => {
          const idx = pendingPreferencesSaves.indexOf(promise);
          if (idx > -1) pendingPreferencesSaves.splice(idx, 1);
        });
      };
    } catch (e) {
      console.error("Failed to initialize Preferences bootstrap:", e);
      isPreferencesReady = false;
    }
  } else {
    isPreferencesReady = true;
  }

  // Prevent context menu (right click / long press) to make it feel like a native app
  window.addEventListener("contextmenu", (e) => {
    // Allow context menu on inputs and textareas so users can paste text
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    e.preventDefault();
  });

  // Flush preferences aggressively when app goes to background
  const flushPreferences = async () => {
    if (Capacitor.isNativePlatform() && isPreferencesReady && pendingPreferencesSaves.length > 0) {
      try {
        console.log(`[FLUSH] Flushing ${pendingPreferencesSaves.length} pending Preferences saves...`);
        // Wait for ALL pending Preferences saves to complete before allowing suspension
        await Promise.all(pendingPreferencesSaves);
        console.log("[FLUSH] All Preferences saves flushed successfully");
      } catch (e) {
        console.error("[FLUSH] Preferences flush error:", e);
      }
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushPreferences();
    } else if (document.visibilityState === "visible" && Capacitor.isNativePlatform()) {
      // App resumed - check API key is still there
      const state = localStorage.getItem("revisionMasterState");
      if (state) {
        try {
          const parsed = JSON.parse(state);
          console.log("[APP] App resumed. API key status:", {
            hasCustomKey: !!parsed.user?.customApiKey,
            hasApiKeys: !!Object.keys(parsed.user?.apiKeys || {}).length,
          });
        } catch (e) {
          console.error("Failed to parse state on resume:", e);
        }
      }
    }
  });

  document.addEventListener("pause", flushPreferences);
  window.addEventListener("beforeunload", flushPreferences);

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrapApp();
