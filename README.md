# Revision Master

Welcome to **Revision Master**, your ultimate companion for exam preparation. This app helps you organize your study materials, track your revisions, and stay on top of your academic goals.

## ✨ Features

- **Subject Management:** Add, edit, and organize your subjects with custom colors.
- **Unit & Topic Tracking:** Break down subjects into units and topics.
- **Revision Tracking:** Track your revision progress (1st, 2nd, 3rd, 4th revision) with visual indicators.
- **Flashcards & Formulas:** Create, study, and organize flashcards and formulas into custom decks.
- **AI-Powered Generation:** Use MKR Ai (powered by Google Gemini) to instantly generate flashcards and study materials from any topic.
- **PDF Export:** Export your flashcard decks as beautifully formatted, printable PDF study guides.
- **Data Backup & Restore:** Export all your data as a JSON backup and import it anytime to keep your progress safe.
- **Progress Analytics:** View your overall progress, daily streaks, and completion rates.
- **Settings & Customization:** Personalize your app experience, including themes, avatars, and custom API keys.


---

## 📱 Android Installation (APK)

If you have received an APK file for Revision Master, follow these steps to install it on your Android device:

### 1. Transfer the APK
Transfer the `.apk` file to your phone's internal storage via USB, Bluetooth, or cloud storage.

### 2. Enable "Unknown Sources"
For security, Android blocks installations from outside the Google Play Store by default.
- Go to **Settings** > **Apps** > **Special app access**.
- Select **Install unknown apps**.
- Choose the app you are using to open the APK (e.g., Chrome or File Manager) and toggle **Allow from this source**.

### 3. Install the App
- Open your File Manager and locate the APK file.
- Tap on the file and select **Install**.

### 4. Addressing the "Play Protect" / "Scan App" Prompt
During installation, you might see a prompt from Google Play Protect saying "Unsafe app blocked" or asking to "Scan app".
- **Why this happens:** This is a standard warning for apps not yet published on the Play Store.
- **How to proceed:** Tap on **"Install anyway"** or **"More details"** then **"Install anyway"**. Our app is safe and designed for your educational success.

---

## 💻 Developer Setup

To run the project locally for development:

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/mkr-infinity/revision-master.git
cd revision-master
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## 🏗️ Building APK using Capacitor (Android)

Revision Master is fully configured to be built as a native Android app using Capacitor. Follow these steps to generate your APK:

### Prerequisites
- **Node.js** (v18 or higher)
- **Android Studio** installed on your machine
- **Java Development Kit (JDK)** (usually bundled with Android Studio)

### 1. Build the Web Project
First, compile the React/Vite web application into static files:
```bash
npm run build
```

### 2. Add Android Platform (If not already added)
If the `android` folder doesn't exist in your project root, add it:
```bash
npx cap add android
```

### 3. Sync with Native Platforms
Copy the built web assets into the Android project:
```bash
npx cap sync android
```

### 4. Open in Android Studio
Open the generated Android project in Android Studio:
```bash
npx cap open android
```

### 5. Build the APK in Android Studio
Once Android Studio has loaded and synced the Gradle project:
1. Go to the top menu bar and click on **Build**.
2. Select **Build Bundle(s) / APK(s)**.
3. Click on **Build APK(s)**.
4. Wait for the Gradle build to finish.
5. A notification will appear in the bottom right corner. Click **locate** to open the folder containing your `app-debug.apk`.

You can now transfer this APK to your Android device and install it!

---

## 🎨 Customizing the App Logo (Capacitor)

If you want to use a custom app logo for your Capacitor project, you should use the `@capacitor/assets` tool. Here are the dimensions and things to keep in mind:

### Required Source Images
You need to provide high-resolution source images in an `assets/` folder at the root of your project:

1. **`assets/icon.png` (or `icon.jpeg`)**
   - **Dimensions:** Minimum `1024x1024` pixels.
   - **Format:** PNG (recommended) or JPEG.
   - **Note:** This is the primary app icon. Keep the main logo centered and avoid putting critical details near the edges, as different devices (especially Android) apply different masks (circle, squircle, teardrop).

2. **`assets/splash.png` (or `splash.jpeg`)**
   - **Dimensions:** Minimum `2732x2732` pixels.
   - **Format:** PNG (recommended) or JPEG.
   - **Note:** This is the splash screen background. Keep the logo/branding strictly in the center safe zone (roughly the middle `1200x1200px`) because the edges will be cropped heavily depending on the device's aspect ratio (phones vs. tablets).

3. **`assets/icon-only.png` & `assets/icon-background.png` (Optional for Android Adaptive Icons)**
   - **Dimensions:** Minimum `1024x1024` pixels.
   - **Note:** Android 8.0+ uses adaptive icons consisting of a foreground (`icon-only.png` with transparency) and a background (`icon-background.png` without transparency).

### How to Generate the Icons
Once your source images are placed in the `assets/` folder, run the following command to automatically generate all the required sizes for Android and iOS:

```bash
npx @capacitor/assets generate
```

### Things to Keep in Mind for Capacitor
- **Safe Zones:** Always design your icons and splash screens with a "safe zone" in mind. Keep your core logo centered.
- **Transparency:** iOS does not support transparency in app icons (it will render as black). Ensure your `icon.png` has a solid background color.
- **Android Adaptive Icons:** For the best look on modern Android devices, provide separate foreground and background images so the OS can apply parallax effects and custom shapes.
- **Rebuilding:** After generating new assets, you must sync and rebuild your native projects (`npx cap sync android` and then run it in Android Studio).

---


## 📄 License
This project is licensed under the MIT License.

---
*Made with ❤️ by Mohammad Kaif Raja.*
