/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  /** Google OAuth 2.0 Web client ID (Authorised JavaScript origin = your app URL). */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  /** Apple Services ID (Sign in with Apple JS, popup mode). */
  readonly VITE_APPLE_CLIENT_ID?: string;
  /** Apple Return URL, e.g. https://yourapp.com/auth/callback */
  readonly VITE_APPLE_REDIRECT_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module "react-dom" {
  import type { ReactNode } from "react";

  export function createPortal(children: ReactNode, container: Element | DocumentFragment): ReactNode;
}

declare module "react-dom/client" {
  import type { ReactElement } from "react";

  export interface Root {
    render(children: ReactElement): void;
    unmount(): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;
}
