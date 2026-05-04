<div align="center">
  <img src="assets/icon.png" width="160" height="160" alt="Revision Master Logo">
  <h1>Revision Master</h1>
  <p align="center">
    <b>The Anime-Themed Companion for Exam Excellence</b><br>
    <i>Flashcards, formulas, mock tests &amp; AI-generated study material — wrapped in a manga / anime aesthetic with six anime-inspired theme worlds.</i>
  </p>

  <div align="center">
    <img src="https://img.shields.io/badge/version-2.0.0-ff3a5e?style=for-the-badge" alt="Version">
    <img src="https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge" alt="License">
    <img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
    <img src="https://img.shields.io/badge/Capacitor-8-119EFF?style=for-the-badge&logo=capacitor&logoColor=white" alt="Capacitor">
    <img src="https://img.shields.io/badge/Offline%20PWA-yes-success?style=for-the-badge" alt="Offline PWA">
  </div>
</div>


---
## 📲 Download the App

<div align="center">

<a href="https://github.com/mkr-infinity/Revision-Master/releases/download/v2.0.1/Revision-Master_v2.0.1.apk">
  <img src="https://img.shields.io/badge/⬇️%20Download%20APK-Revision%20Master-blue?style=for-the-badge&logo=android" />
</a>


<a href="https://github.com/mkr-infinity/Revision-Master/releases/latest">
  <img src="https://img.shields.io/badge/🚀%20Latest%20Release-Get%20Now-success?style=for-the-badge&logo=github" />
</a>

----

<a href="https://mkr-infinity.github.io/Revision-Master" target="_blank">
  <img src="https://img.shields.io/badge/🌐%20Explore%20Features%20%26%20Screenshots-Visit%20Website-blueviolet?style=for-the-badge" />
</a>

</div>




### 📌 Installation Steps
1. Download the APK file  
2. Enable **Install from Unknown Sources**  
3. Open the APK and install  
4. Enjoy the app 🎉


---


## 🌟 Why Revision Master?

In a world full of distractions, **Revision Master** is built to keep you focused. It's not just another study app; it's a precision tool designed for students who value their time and data.

### 🛡️ Privacy Focused (Local-First)
Your study habits and data are yours alone. Revision Master follows a **Local-First Architecture**:
- **Zero Cloud Storage:** All your subjects, flashcards, and progress are stored securely on your device.
- **No Tracking:** No analytics, no cookies, no hidden trackers.
- **Full Control:** Export your entire database as a JSON backup anytime. We don't lock you in.

### ⚡ Built for Speed & Utility
- **Native Experience:** Optimized for mobile with buttery-smooth animations and instant tab switching.
- **Offline Ready:** Study anywhere, anytime. No internet connection required for core features.
- **AI-Powered:** Generate flashcards and study materials instantly using **MKR Ai** (powered by Google Gemini).

---

## What's New in v2.0.0 — Anime Edition


### Anime Theme System
- Full anime / manga aesthetic across **every** screen, popup and modal — not just fonts.
- Themes are no longer plain colors — each one is a full anime-world style:
  | Theme | Anime | Vibe |
  |---|---|---|
  | Demon Slayer | Tanjiro | Crimson red + black/green haori checker |
  | My Hero Academia | Deku / All Might | Hero blue + Plus Ultra yellow rays |
  | Naruto | Hokage | Hidden-Leaf cream + Rasengan orange swirls |
  | Jujutsu Kaisen | Gojo | Cursed-energy violet + swirling rays |
  | Bleach | Zanpakuto | Hollow black + Reiatsu cyan slashes |
  | Vinland Saga | Norse | Frost teal + cream rune crosshatching |
- New manga elements: speech bubbles, halftones, speed lines, bold black/white borders with offset shadows, kira sparkles, chibi mascot.
- Onboarding: chibi mascot + Skip button on every step + ★ Offline-ready.
- Settings → Appearance → "Use system default font" if you don't want the manga font.


See the full [`CHANGELOG.txt`](./CHANGELOG.txt).

---

## ✨ Powerful Features

| Feature | Description |
|-------|-------------|
| <img src="assets/features/subjects.svg" width="40"> **Smart Subjects** | Organize study material with custom icons and progress tracking |
| <img src="assets/features/flashcards.svg" width="40"> **Active Recall** | Interactive flashcards with support for text, images, formulas |
| <img src="assets/features/tests.svg" width="40"> **Exam Simulation** | Create custom mock tests to simulate real exam conditions |
| <img src="assets/features/ai.svg" width="40"> **AI Study Buddy** | Generate flashcards and explanations using MKR AI |
| <img src="assets/features/analytics.svg" width="40"> **Deep Insights** | Track progress with statistics and performance heatmaps |
| <img src="assets/features/pdf.svg" width="40"> **Offline Study** | Export flashcards and decks as PDFs |

---

## Project Structure

```
📦 Revision Master
├── 📱 Mobile App (React + Capacitor + Vite)
│   ├── src/
│   │   ├── components/        # UI components (Layout, Chatbot, modals, providers)
│   │   ├── context/           # AppContext (themes, user, decks, tests, AI settings)
│   │   ├── screens/           # App screens (Home, Flashcards, MockTests, Stats, Settings, About, Onboarding, FormulaLibrary, RecycleBin, Changelog)
│   │   ├── types/             # TypeScript definitions
│   │   ├── utils/             # AI client, PDF export, utilities
│   │   ├── assets/            # Icons and feature SVGs
│   │   ├── index.css          # Tailwind v4 + 6 anime-themed palettes + manga utilities
│   │   ├── App.tsx            # Main App component
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   ├── android/               # Capacitor Android native project
│   │   ├── app/               # Android app (build files, AndroidManifest.xml, resources)
│   │   └── capacitor-cordova-android-plugins/
│   ├── capacitor.config.ts    # Capacitor config (StatusBar, Splash, mixed-content)
│   ├── vite.config.ts         # Vite + PWA + code splitting for fast loads
│   ├── tsconfig.json          # TypeScript configuration
│   └── package.json           # Dependencies
│
├── 🌐 Website (React + Vite + Shadcn UI)
│   ├── website/src/
│   │   ├── components/        # UI components (Hero, Features, Screenshots, Footer, etc.)
│   │   ├── pages/             # Pages (Home, not-found)
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── website/public/        # Static assets
│   └── website/package.json
│
├── 📚 Assets
│   ├── assets/icons/          # App icons
│   ├── assets/features/       # Feature SVGs
│   ├── assets/screenshotv2/   # App screenshots
│   └── assets/mockups/        # UI mockups
│
├── 📖 Documentation
│   ├── README.md              # Project overview
│   ├── BUILD_GUIDE.md         # Web deployment guide
│   ├── CAPACITOR_GUIDE.md     # Capacitor setup guide
│   ├── CHANGELOG.txt          # Version history
│   └── metadata.json          # Project metadata
│
└── ⚙️ Configuration
    ├── serve-website.js       # Website server script
    ├── update-colors.ts       # Theme color generator
    └── .github/workflows/apk.yml  # GitHub Actions — debug APK builder
```

---



## 📦 Getting Started

### 🌐 Web Development
To run the project locally for development:

> [!TIP]
> For a detailed guide on web deployment and hosting, see our [**Web Build Guide**](./BUILD_GUIDE.md).


---


## 💖 Support

<p align="center">
  <a href="https://buymeacoffee.com/mkr_infinity" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="55" alt="Buy Me A Coffee"/>
  </a>
</p>

<p align="center">
  If you like <b>Revision Master</b>, please consider supporting 🙌
</p>

<br>

<p align="center">
  <a href="https://supportmkr.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/Other%20Ways%20to%20Support-Click%20Here-blue?style=for-the-badge"/>
  </a>
</p>

