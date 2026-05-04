🚀 Revision Master — Build APK Guide (React + Capacitor)

This guide helps you:

- 📱 Build APK locally (debug & release)
- 🔐 Create and use a release keystore for signing
- ⚡ Generate signed artifacts in CI (GitHub Actions)

---

📦 Requirements

Install locally:

- Node.js (v22 recommended)
- Android Studio (SDK + platform-tools)
- Java JDK 21 (or matching Gradle toolchain)

Quick checks:

```bash
node -v
java -version
```

---

⚙️ Local Setup

Install dependencies:

```bash
npm ci
```

Add the Capacitor Android platform (first time only):

```bash
npx cap add android
npx cap sync android
```

Create a development env file for local API keys:

```text
# .env
VITE_GEMINI_API_KEY=your_api_key_here
```

---

🏗 Build the Web App (Vite)

```bash
npm run build -- --mode production
```

Then sync the built web assets into the native project:

```bash
npx cap sync android
```

---

🎨 Generate Adaptive Icons (optional)

Place a square `resources/icon.png` (1024×1024 recommended) then:

```bash
npm install @capacitor/assets --no-save
npx capacitor-assets generate --android
```

---

📱 Build Debug APK (local)

```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

Use Android Studio for an IDE workflow:

```bash
npx cap open android
```

---

🔐 Create a Release Keystore (local)

Generate a keystore for signing release builds (keep this secure):

```bash
keytool -genkeypair -v \
  -keystore release-keystore.jks \
  -alias revision_master_key \
  -keyalg RSA -keysize 2048 -validity 10000
```

Create `key.properties` in the `android/` folder (do NOT commit secrets):

```text
storeFile=release-keystore.jks
storePassword=your_store_password
keyAlias=revision_master_key
keyPassword=your_key_password
```

Update `android/app/build.gradle` signingConfigs to reference `key.properties` (Android Gradle config).

---

📦 Build Signed Release APK / AAB (local)

Build a release AAB (recommended for Play Store):

```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

Or build a signed release APK:

```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

Use Android Studio → Build → Generate Signed Bundle / APK for a guided flow.

---

🛡️ Signing & Play Store notes

- Keep your `release-keystore.jks` and passwords secure — losing them prevents updates.
- Prefer AAB for Play Store uploads.
- Increment `versionCode` and `versionName` in `android/app/build.gradle` before releases.

---

⚡ CI: Build & Sign in GitHub Actions (example)

This example builds a signed release using a base64-encoded keystore stored in repo secrets. Create the following secrets in your repository settings:

- `GEMINI_API_KEY` — your Vite API key (if needed)
- `RELEASE_KEY_BASE64` — base64-encoded contents of `release-keystore.jks`
- `RELEASE_STORE_PASSWORD` — keystore password
- `RELEASE_KEY_ALIAS` — key alias (e.g. revision_master_key)
- `RELEASE_KEY_PASSWORD` — key password

Example workflow (save as `.github/workflows/build.yml`):

```yaml
name: Build Signed AAB

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Create .env
        run: echo "VITE_GEMINI_API_KEY=${{ secrets.GEMINI_API_KEY }}" > .env

      - name: Build web assets
        run: npm run build -- --mode production

      - name: Add Android
        run: npx cap add android || true

      - name: Sync Capacitor
        run: npx cap sync android

      - name: Decode release keystore
        env:
          KEY_B64: ${{ secrets.RELEASE_KEY_BASE64 }}
        run: |
          echo "$KEY_B64" | base64 --decode > android/release-keystore.jks

      - name: Write key.properties
        run: |
          cat > android/key.properties <<EOF
storeFile=release-keystore.jks
storePassword=${{ secrets.RELEASE_STORE_PASSWORD }}
keyAlias=${{ secrets.RELEASE_KEY_ALIAS }}
keyPassword=${{ secrets.RELEASE_KEY_PASSWORD }}
EOF

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21

      - name: Build Release AAB
        run: |
          cd android
          chmod +x gradlew
          ./gradlew bundleRelease

      - name: Upload AAB
        uses: actions/upload-artifact@v4
        with:
          name: app-release-aab
          path: android/app/build/outputs/bundle/release/app-release.aab
```

---

📦 CI Output

- You will find the signed artifacts under Actions → Artifacts after a successful run.

---

❗ Security

- Never commit keystore files or passwords. Use repository secrets for CI.
- Consider using Google Play App Signing for additional protection.

---

💡 Built with React + Capacitor
