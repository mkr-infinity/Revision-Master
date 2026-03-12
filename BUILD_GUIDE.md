# Build Guide: Android APK (Debian/Linux)

This guide explains how to build the Revision Master Android APK from source using the terminal on a Debian-based system.

## Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js & npm**:
    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```
    *Note: It's recommended to use a recent LTS version of Node.js.*

2.  **Java Development Kit (JDK) 17**:
    ```bash
    sudo apt install openjdk-17-jdk
    ```

3.  **Android SDK**:
    Download the command-line tools from the [Android Studio website](https://developer.android.com/studio#command-line-tools-only).
    Extract them to a directory (e.g., `~/Android/Sdk`) and set the `ANDROID_HOME` environment variable:
    ```bash
    export ANDROID_HOME=$HOME/Android/Sdk
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
    ```

## Build Steps

Follow these steps in the project root directory:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Crucial for AI Features)
To ensure the MKR Ai features work in your built APK, you must provide a Gemini API key.
1. Copy the `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and replace `"MY_GEMINI_API_KEY"` with your actual Gemini API key.
   ```env
   GEMINI_API_KEY="your_actual_api_key_here"
   ```
   *Note: This key will be bundled into the app as the default/public key. Users can still override it with their own key in the app's Settings.*

### 3. Build the Web Application
```bash
npm run build
```

### 4. Sync with Capacitor
This command copies the built web assets into the Android project.
```bash
npx cap sync
```

### 4. Build the APK
Navigate to the `android` directory and use the Gradle wrapper to build the APK.

#### For Debug APK:
```bash
cd android
./gradlew assembleDebug
```
The APK will be generated at: `android/app/build/outputs/apk/debug/app-debug.apk`

#### For Release APK (Unsigned):
```bash
cd android
./gradlew assembleRelease
```
The APK will be generated at: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

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
