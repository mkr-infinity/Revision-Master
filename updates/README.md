# Revision Master Update & Build Guide

This folder contains essential files for maintaining the application and notifying users about updates.

## 📁 Files in this folder
- `update.json`: The source of truth for app updates (Native Android).
- `version.json`: Legacy version info (Web/Fallback).
- `README.md`: This guide.

## 🚀 How to Build a Release APK using GitHub Actions
1.  **Prepare Keystore:** Generate a `.jks` file.
2.  **GitHub Secrets:** Add these to your repo secrets:
    - `SIGNING_STORE_FILE`: Base64 of your `.jks` file.
    - `SIGNING_STORE_PASSWORD`
    - `SIGNING_KEY_ALIAS`
    - `SIGNING_KEY_PASSWORD`
3.  **Push to Main:** The `apk.yml` workflow will build and sign the APK automatically.
4.  **Download:** Get the APK from the Actions tab artifacts.

## 🔔 How to Notify Users of an Update (Native System)
The Android app uses `UpdateManager.kt` to check `update.json`.

1. **Build & Upload the new APK** to GitHub Releases or any direct download host.
2. **Update `android/app/build.gradle`**: Increment `versionCode` and update `versionName`.
3. **Update `update.json`** in this folder:
   - `versionCode`: **CRITICAL** - This must match the new `versionCode` in `build.gradle`. The app uses this number to determine if an update is available.
   - `versionName`: The user-facing version (e.g., "1.1").
   - `downloadUrl`: Direct link to the `.apk` file.
   - `releaseNotes`: List of changes.
4. **Push to Main**: The app will detect the change (it checks the raw URL of this file on GitHub) and prompt the user to download.

## 🛠 Manual Update Check
Users can manually check for updates in **Settings > Check for Updates**. This triggers a toast "Checking for updates..." and then shows the update dialog if a higher `versionCode` is found in the remote `update.json`.

---
Maintainer: @mkr_infinity
