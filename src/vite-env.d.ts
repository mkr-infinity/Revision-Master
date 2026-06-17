/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
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
