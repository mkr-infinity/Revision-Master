# 📱 Capacitor Android Build Guide (APK)

This guide explains how to convert **Revision Master** into a native Android application (APK) using Capacitor, including how to customize your app icon, splash screen, and settings.

---

## 🚀 1. Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **Node.js** (v18 or higher)
- **Android Studio** (with Android SDK and Build Tools)
- **Java Development Kit (JDK)** (v17 is recommended for modern Android)

---

## 🛠️ 2. Initial Setup

If you haven't already initialized the Android project in your local environment:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Build the Web Project:**
   ```bash
   npm run build
   ```

3. **Add Android Platform:**
   ```bash
   npx cap add android
   ```

---

### 🎨 3. Customizing the "Outside" Logo (Home Screen Icon)

The logo you see on your phone's home screen before opening the app is called the **Native Icon**. Because of mobile security, this cannot be changed easily from inside the app settings. You must set it during the build process:

1. **Prepare your source image:**
   - Use the `src/assets/logo.svg` I created.
   - Export it as a high-quality PNG (1024x1024px) named `icon-only.png`.
   - Place it in an `assets/` folder in your project root.

2. **Generate Native Assets:**
   Run this command to "inject" your logo into all the required Android system folders:
   ```bash
   npx @capacitor/assets generate --android
   ```
   *This replaces the default Capacitor logos in the Android system with your custom branding.*

3. **Verify in Android Studio:**
   When you build your APK, Android Studio will now use this logo for the installer and the home screen icon.

---

## ⚙️ 4. Changing App Settings

### A. App Name & Bundle ID
Edit `capacitor.config.ts` in the root directory:
```typescript
const config: CapacitorConfig = {
  appId: 'com.yourname.revisionmaster', // Change this to your unique bundle ID
  appName: 'My Revision App',           // Change this to your desired App Name
  webDir: 'dist',
  // ...
};
```

### B. Android Specific Settings
To change the App Name as it appears on the phone's home screen, edit:
`android/app/src/main/res/values/strings.xml`
```xml
<string name="app_name">My Revision App</string>
```

---

## 📦 5. Building the APK

1. **Sync your web changes to Android:**
   ```bash
   npm run build
   ```
   ```bash
   npx cap copy android
   ```

2. **Open the project in Android Studio:**
   ```bash
   npx cap open android
   ```

3. **In Android Studio:**
   - Wait for Gradle to finish syncing.
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Once finished, a notification will appear. Click **Locate** to find your `app-debug.apk`.

---

## 🔐 6. Generating a Release APK (for Play Store)

To create a signed APK for distribution:
1. In Android Studio, go to **Build > Generate Signed Bundle / APK...**
2. Select **APK**.
3. Create a new **Key Store** (keep this file safe!).
4. Select **release** build variant.
5. The resulting APK will be ready for installation on any device.

---

## 💡 Pro Tips
- **Live Reload:** During development, you can run `npx cap run android -l --external` to see changes instantly on your device.
- **App Logo Sync:** The in-app "App Logo" setting changes the logo *inside* the app. To change the home screen logo, follow the asset generation steps above.
- **Permissions:** If you add features like Camera or Geolocation, remember to update `AndroidManifest.xml`.

---

*Developed with ❤️ by MKR Infinity*
