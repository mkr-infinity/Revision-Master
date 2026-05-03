🚀 Revision Master — Build APK Guide (React + Capacitor)

This guide helps you:

- 📱 Build APK locally
- ⚡ Generate APK using GitHub Actions

---

📦 Requirements

Install:

- Node.js (v22 recommended)
- Android Studio (with SDK)
- Java JDK 21

Check:

node -v
java -version

---

⚙️ Local Setup

Install dependencies:

npm install

---

🔐 Add API Key

Create ".env" file:

VITE_GEMINI_API_KEY=your_api_key_here

---

🏗 Build React App

npm run build -- --mode production

---

📱 Add Android (First Time)

npx cap add android

---

🔄 Sync Project

npx cap sync android

---

🎨 Generate Icons (Optional)

Put icon in:

resources/icon.png

Run:

npm install @capacitor/assets --no-save
npx capacitor-assets generate --android

---

🚀 Build APK (CLI)

cd android
chmod +x gradlew
./gradlew assembleDebug

APK output:

android/app/build/outputs/apk/debug/app-debug.apk

---

🖥 Build via Android Studio

npx cap open android

Then:

- Build → Build APK
- Or press ▶️ Run

---

⚡ Quick Run

npx cap run android

---

🔁 Update Changes

npm run build
npx cap sync android

---

❗ Troubleshooting

Java Error (invalid source release 21)

Install Java 21:

java -version

---

App not updating

npm run build
npx cap sync

---

🧠 Build Flow

Code → Build → Sync → APK

---

⚡ Build APK using GitHub Actions

You can automatically generate APK using GitHub Actions.

📌 Steps

1. Go to your repo → Settings → Secrets
2. Add secret:

GEMINI_API_KEY = your_api_key

3. Create file:

.github/workflows/build.yml

4. Paste this YAML 👇

name: Build APK (Node 22 + Icons + Storage Fix)

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node 22
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm install

      - name: Create .env file
        run: |
          echo "VITE_GEMINI_API_KEY=${{ secrets.GEMINI_API_KEY }}" > .env

      - name: Create localStorage patch
        run: |
          mkdir -p public
          cat << 'EOF' > public/localstorage-fix.js
          (function () {
            if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
              const pref = window.Capacitor.Plugins.Preferences;

              const originalSet = localStorage.setItem;
              const originalGet = localStorage.getItem;

              localStorage.setItem = function (key, value) {
                try {
                  pref.set({ key: key, value: value });
                } catch (e) {
                  originalSet.call(localStorage, key, value);
                }
              };

              localStorage.getItem = function (key) {
                try {
                  let value = null;
                  pref.get({ key: key }).then(function (res) {
                    value = res.value;
                  });
                  return value;
                } catch (e) {
                  return originalGet.call(localStorage, key);
                }
              };
            }
          })();
          EOF

      - name: Inject script into index.html
        run: |
          sed -i 's|</head>|<script src="/localstorage-fix.js"></script></head>|' index.html

      - name: Build React app
        run: npm run build -- --mode production

      - name: Add Android platform
        run: npx cap add android

      - name: Generate adaptive launcher icons
        run: |
          if [ -f "resources/icon.png" ] || [ -f "resources/icon-foreground.png" ]; then
            npm install @capacitor/assets --no-save
            npx capacitor-assets generate --android
          else
            echo "::warning::No icon files found in resources/ — using default Capacitor icon."
          fi

      - name: Sync Capacitor
        run: npx cap sync android

      - name: Setup Java (JDK 21)
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21

      - name: Build Debug APK
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk

---

📦 Output

- APK available in Actions → Artifacts
- Download and install on your device

---

📌 Notes

- Uses Vite env ("VITE_*")
- Debug APK only (not for Play Store)
- localStorage patch included (best-effort fix)

---

🚀 Future Improvements

- Signed release APK
- Play Store deployment
- Secure API key (backend proxy)
- Proper storage using Capacitor Preferences

---

💡 Built with React + Capacitor
