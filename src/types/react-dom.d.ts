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