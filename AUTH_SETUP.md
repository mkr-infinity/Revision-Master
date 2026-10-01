# Sign-in setup — Google & Apple

Revision Master now opens on a **login screen** with three ways in:

| Button | What happens | Needs config? |
| --- | --- | --- |
| **Continue with Google** | Google Identity Services popup → reads name, email, photo | `VITE_GOOGLE_CLIENT_ID` |
| **Continue with Apple** | Sign in with Apple JS popup → reads name, email | `VITE_APPLE_CLIENT_ID` + `VITE_APPLE_REDIRECT_URI` |
| **Continue as guest** | Instant offline profile, no provider round-trip | nothing |

> **No keys configured?** The screen still works — Google/Apple fall back to a
> local *demo* profile (clearly badged `DEMO`) so you can click through the flow.
> Everything below is what you do to make the real OAuth popups appear.

---

## 1. Create your `.env`

```bash
cp .env.example .env
```

```dotenv
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com
VITE_APPLE_CLIENT_ID=app.revisionmaster.web
VITE_APPLE_REDIRECT_URI=http://localhost:5000/auth/callback
```

Restart the dev server after editing (Vite only reads env at boot). Vite exposes
any `VITE_*` value to the client bundle, which is fine here — these are **public**
OAuth client IDs, not secrets.

---

## 2. Google — OAuth client ID

1. Open <https://console.cloud.google.com/> → create/select a project.
2. **APIs & Services → OAuth consent screen** → External → fill in app name,
   support email and the `…/auth/userinfo.email` + `…/auth/userinfo.profile`
   scopes (these are non-sensitive, so no Google verification review is needed).
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   → Application type: **Web application**.
4. Under **Authorised JavaScript origins** add every origin you serve the app
   from — no trailing slash:
   - `http://localhost:5000` (local dev)
   - `https://mkr-infinity.github.io` (GitHub Pages)
   - `https://your-domain.com` (custom domain / PWA)
5. Copy the **Client ID** into `VITE_GOOGLE_CLIENT_ID`.

The code uses the *token client* (`initTokenClient`) with `openid email profile`
scope and then calls `https://www.googleapis.com/oauth2/v3/userinfo` to build the
profile — no server component required.

---

## 3. Apple — Services ID

Sign in with Apple on the web needs a paid Apple Developer account.

1. **Certificates, Identifiers & Profiles → Identifiers → App IDs**: create an
   App ID (e.g. `app.revisionmaster`) and tick **Sign in with Apple**.
2. **Identifiers → Services IDs → ➕**: create a Services ID, e.g.
   `app.revisionmaster.web` → **Configure**:
   - **Primary App ID**: the App ID from step 1
   - **Domains and Subdomains**: `localhost` for dev, plus your real domain
   - **Return URLs**: `http://localhost:5000/auth/callback` and
     `https://your-domain.com/auth/callback`
     (plain `http://` is only accepted for `localhost` — production must be https)
3. Put the **Services ID** in `VITE_APPLE_CLIENT_ID` and the same return URL in
   `VITE_APPLE_REDIRECT_URI`.

Apple only sends the user's **name on the very first authorisation**; later
sign-ins return email + `sub` only. Store the name on that first login if you
need it permanently.

---

## 4. How the flow is wired in the app

```
Login screen  (src/screens/Login.tsx)
      │  click
      ▼
src/utils/auth.ts ──► Google GIS / Apple JS popup ──► profile {name,email,picture}
      │
      ▼
AppContext.signIn()  →  state.auth = { isAuthenticated, account }
      │
      ▼
App.tsx route gate → /onboarding/1 (first run) or / (already onboarded)
```

* **Gate:** `src/App.tsx` redirects every unauthenticated route to `/login`,
  and sends signed-in users away from `/login`.
* **State:** `state.auth` lives beside the existing `state.user` inside the
  `revisionMasterState` local-storage blob, so it survives reloads, is included
  in Settings → Export backups, and is mirrored to Capacitor Preferences on
  Android like everything else.
* **No tokens are persisted.** Only `{ provider, providerId, email, name,
  picture, signedInAt }` is saved. Access/ID tokens stay in memory and are
  discarded after the profile is read.
* **`/auth/callback`** (`src/screens/AuthCallback.tsx`) catches redirect-style
  responses (`#id_token=…`) for setups that prefer redirects over popups.
  Authorisation-**code** responses need a server-side token exchange — that is
  intentionally not implemented; use popup mode.

### Sign out

**Settings → Account → Sign out** (confirmation modal). Signing out clears only
the session; decks, cards, streaks and stats stay on the device, so the next
sign-in lands straight back in your study data.

---

## 5. Android / iOS (Capacitor) builds

In-app OAuth popups don't exist inside a native WebView, so pressing
Google/Apple in the APK shows a friendly notice and points to guest mode. To
support it properly you need a deep-link flow:

1. `@capacitor/browser` → open the provider's authorise URL in the system browser.
2. Register a custom scheme (`app.revisionmaster://auth`) in `capacitor.config.ts`
   and `AndroidManifest.xml`.
3. Point the provider's return URL at that scheme.
4. Exchange the returned code for a token **on a backend** and hand the session
   back to the app.

`appId` in `capacitor.config.ts` is already `com.revisionmaster.app`, so the
scheme would be `com.revisionmaster.app://auth`.

---

## 6. Production hardening (recommended)

The app is deliberately backend-free, which means:

* ID tokens are **decoded, not cryptographically verified** on the client. That
  is fine for a local-first study app where the profile is cosmetic, but if you
  ever gate paid content or sync data server-side, verify the `id_token` /
  access token on your server (Google JWKS, Apple's `https://appleid.apple.com/auth/keys`)
  and check `aud`, `iss` and `exp`.
* Use `nonce` (Google) / `state` (Apple) round-trips on the server for CSRF
  protection — the Apple flow already sends a SHA-256-hashed nonce.
* Add a "Delete my account & data" action if you ship to a store — Apple's
  guidelines require it once you offer account creation.

---

## 7. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Popup window closed` | Normal when the consent popup is dismissed. Nothing is broken. |
| Google: `invalid_client` / `The given origin is not allowed` | Add the exact origin (scheme + host + port, no path, no trailing slash) to **Authorised JavaScript origins**. |
| Google: `access_blocked` | Your Google Cloud OAuth app is in "Testing" — add the signing-in account under **Test users**, or publish the app. |
| Apple: `invalid_request` / popup flashes and closes | Return URL must match the Services ID exactly, and `http://` is only allowed for `localhost`. |
| Google flow opens but nothing happens in the APK | Expected — see §5 (deep links needed). Use guest mode meanwhile. |
| Real IDs set but buttons still say `DEMO` | Restart the dev server; Vite reads `.env` at boot. Confirm the file is `.env` in the project root. |
