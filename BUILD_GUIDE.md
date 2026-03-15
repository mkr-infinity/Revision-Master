# Build Guide: Android APK (Debian/Linux)

This guide explains how to build the Revision Master Android APK from source using the terminal on a Debian-based system or via GitHub Actions.

## Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js & npm**:
    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```
    *Note: It's recommended to use Node.js v22.*

2.  **Java Development Kit (JDK) 21**:
    ```bash
    sudo apt install openjdk-21-jdk
    ```

3.  **Android SDK**:
    Download the command-line tools from the [Android Studio website](https://developer.android.com/studio#command-line-tools-only).
    Extract them to a directory (e.g., `~/Android/Sdk`) and set the `ANDROID_HOME` environment variable:
    ```bash
    export ANDROID_HOME=$HOME/Android/Sdk
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
    ```

## The Easiest Way: Using GitHub Actions (Recommended for Beginners)

If you just downloaded the ZIP file and want to get the APKs without installing Android Studio or any build tools on your computer, follow these steps:

1. **Create a GitHub Account:** If you don't have one, sign up at [github.com](https://github.com).
2. **Create a New Repository:** Create a new, **private** repository on your GitHub account.
3. **Upload the Files:** Extract the ZIP file you downloaded. Upload all the extracted files and folders into your new GitHub repository.
4. **Enable GitHub Actions:** Go to the "Actions" tab in your repository and click "I understand my workflows, go ahead and enable them" (if prompted).
5. **Add Your Secrets (Crucial):**
   - Go to your repository's **Settings** > **Secrets and variables** > **Actions**.
   - Click **New repository secret**.
   - Name: `GEMINI_API_KEY` | Secret: Paste your actual Gemini API key.
   - (Optional) Name: `GOOGLE_SERVICES_JSON` | Secret: Paste the content of your `google-services.json` if using Firebase.
   - Click **Add secret**.
6. **Run the Build:**
   - Go back to the **Actions** tab.
   - Click on **Build Android APK** on the left sidebar.
   - Click the **Run workflow** button on the right side.
   - Wait for the process to finish (it usually takes 5-10 minutes).
7. **Download Your APKs:**
   - Once the build is complete (green checkmark), click on the workflow run.
   - Scroll down to the **Artifacts** section.
   - Download the `RevisionMaster-Release-APKs` ZIP file.

---

## Build Steps (Local Terminal)

Follow these steps in the project root directory:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
1. Copy the `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and replace `"MY_GEMINI_API_KEY"` with your actual Gemini API key.

### 3. Build the Web Application
```bash
npm run build
```

### 4. Generate Android Folder (If missing)
If you don't see an `android` folder in your project, run:
```bash
npx cap add android
```

### 5. Sync with Capacitor
This command copies the built web assets into the Android project.
```bash
npx cap sync android
```

### 6. Build the APK
Navigate to the `android` directory and use the Gradle wrapper.

#### For Debug APK:
```bash
cd android
./gradlew assembleDebug
```

#### For Release APK (Unsigned):
```bash
cd android
./gradlew assembleRelease
```

## Signing the Release APK

To install the release APK on a device, it must be signed.

1.  **Generate a Keystore** (if you don't have one):
    ```bash
    keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias
    ```

2.  **Sign the APK**:
    Use `apksigner` (found in `$ANDROID_HOME/build-tools/<version>/`):
    ```bash
    apksigner sign --ks my-release-key.jks --out revision-master-signed.apk android/app/build/outputs/apk/release/app-release-unsigned.apk
    ```

## Troubleshooting

- **Permission Denied**: If `./gradlew` fails with permission denied, run `chmod +x gradlew`.
- **SDK Location**: If Gradle can't find the Android SDK, create a file named `local.properties` in the `android` directory with the following content:
  ```properties
  sdk.dir=/home/your-username/Android/Sdk
  ```
