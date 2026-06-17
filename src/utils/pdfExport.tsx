import html2pdf from "html2pdf.js";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener";
import { Share } from "@capacitor/share";
import { Deck, Card } from "../context/AppContext";

const themeAccent: Record<string, string> = {
  default: "#7c4dff",
  blue: "#5b6dd9",
  green: "#16a47b",
  yellow: "#e0a23a",
  purple: "#7c4dff",
  rose: "#e84d6a",
};

const escape = (s = "") =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const cardImageBlock = (card: Card, side: "front" | "back") => {
  if (!card.image) return "";
  const showOnFront = card.showImageOnFront !== false; // default front
  if (side === "front" && !showOnFront) return "";
  if (side === "back" && showOnFront) return "";
  return `<div style="margin: 8px 0 4px 0; text-align: center;">
    <img src="${card.image}" style="max-width: 100%; max-height: 260px; object-fit: contain; border-radius: 10px; border: 1px solid #e7e3da;" />
  </div>`;
};

const buildHTML = (decks: Deck[], title: string) => {
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let html = `
    <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1b1424;">
      <div style="text-align: center; padding: 28px 16px; border-bottom: 2px solid #e7e3da; margin-bottom: 28px;">
        <div style="display: inline-block; padding: 6px 14px; border-radius: 999px; background: #f3eee5; color: #7c4dff; font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase;">Revision Master · Notebook</div>
        <h1 style="font-size: 32px; font-weight: 800; margin: 14px 0 6px 0; letter-spacing: -0.02em;">${escape(title)}</h1>
        <p style="color: #8a7e94; margin: 0; font-size: 13px;">Generated on ${date}</p>
      </div>
  `;

  decks.forEach((deck) => {
    if (!deck.cards.length) return;

    const accent = themeAccent[deck.cards[0]?.theme || "default"] || "#7c4dff";
    html += `
      <section style="margin-bottom: 36px; page-break-inside: auto;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; padding: 12px 14px; border-radius: 14px; background: #faf7f1; border: 1px solid #efe9de;">
          ${
            deck.coverImage
              ? `<img src="${deck.coverImage}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 10px; border: 1px solid #efe9de;" />`
              : `<div style="width: 44px; height: 44px; border-radius: 10px; background: ${accent}1a; color: ${accent}; display: inline-flex; align-items: center; justify-content: center; font-weight: 800;">${deck.type === "formula" ? "ƒ" : "★"}</div>`
          }
          <div>
            <h2 style="font-size: 20px; font-weight: 800; margin: 0; letter-spacing: -0.01em;">${escape(deck.name)}</h2>
            <div style="color: #8a7e94; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em;">${deck.type} · ${deck.cards.length} ${deck.cards.length === 1 ? "card" : "cards"}</div>
          </div>
        </div>
    `;

    deck.cards.forEach((card, index) => {
      html += `
        <article style="margin-bottom: 14px; padding: 14px 16px; border: 1px solid #ece7dc; border-left: 4px solid ${accent}; border-radius: 12px; background: #ffffff; page-break-inside: avoid;">
          <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: ${accent}; background: ${accent}14; padding: 3px 8px; border-radius: 999px; letter-spacing: 0.12em;">Q${index + 1}</span>
            <span style="font-size: 16px; font-weight: 700; color: #1b1424; line-height: 1.45;">${escape(card.front)}</span>
          </div>
          ${cardImageBlock(card, "front")}
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #d8d2c4;">
            <div style="font-size: 11px; font-weight: 800; color: #8a7e94; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 4px;">Answer</div>
            <div style="font-size: 15px; color: #2b2336; line-height: 1.55; white-space: pre-wrap;">${escape(card.back)}</div>
          </div>
          ${cardImageBlock(card, "back")}
          ${
            card.notes
              ? `<div style="margin-top: 10px; padding: 10px 12px; background: #f7f3ec; border-radius: 10px; font-size: 13px; color: #4f4458;"><strong style="color: ${accent}; font-weight: 800;">Notes:</strong> ${escape(card.notes)}</div>`
              : ""
          }
        </article>
      `;
    });

    html += `</section>`;
  });

  html += `
      <div style="text-align: center; padding: 16px; color: #b6aabb; font-size: 11px; border-top: 1px solid #ece7dc;">
        Made with Revision Master · Premium Study Notebook
      </div>
    </div>
  `;

  return html;
};

export type ExportProgressStage = "preparing" | "rendering" | "saving" | "done" | "error";

export interface ExportProgress {
  stage: ExportProgressStage;
  percent: number; // 0-100
  message: string;
  filePath?: string; // native only
  fileUri?: string; // native opener URI
  error?: string;
}

export interface ExportControl {
  cancel: () => void;
}

export interface ExportOptions {
  onProgress?: (p: ExportProgress) => void;
  signal?: () => boolean; // return true to cancel
}

const safeFilename = (title: string) =>
  title.replace(/[^a-z0-9]/gi, "_").toLowerCase() + "_notebook.pdf";

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        }),
    ),
  );
};

const buildContainer = (decks: Deck[], title: string) => {
  const container = document.createElement("div");
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#1b1424";
  container.style.padding = "24px";
  container.style.fontFamily =
    "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.innerHTML = buildHTML(decks, title);
  return container;
};

const dataUriToBase64 = (uri: string) => {
  const idx = uri.indexOf("base64,");
  return idx >= 0 ? uri.slice(idx + 7) : uri;
};

export const exportDecksToPDF = async (
  decks: Deck[],
  title: string = "Revision Master - Notebook",
  options: ExportOptions = {},
): Promise<ExportProgress> => {
  const { onProgress, signal } = options;
  const native = Capacitor.isNativePlatform();
  const filename = safeFilename(title);

  const emit = (p: ExportProgress) => {
    onProgress?.(p);
    return p;
  };

  emit({ stage: "preparing", percent: 5, message: "Preparing your notebook…" });

  // Preload images so html2canvas captures them.
  const imageUrls: string[] = [];
  decks.forEach((d) => {
    if (d.coverImage) imageUrls.push(d.coverImage);
    d.cards.forEach((c) => c.image && imageUrls.push(c.image));
  });
  await preloadImages(imageUrls);

  if (signal?.()) {
    return emit({ stage: "error", percent: 0, message: "Cancelled", error: "cancelled" });
  }

  emit({ stage: "rendering", percent: 25, message: "Rendering pages…" });

  const container = buildContainer(decks, title);

  const opt = {
    margin: 8,
    filename,
    image: { type: "jpeg" as const, quality: 0.96 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: 800,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
    },
    pagebreak: { mode: ["css", "legacy"] },
  };

  try {
    if (!native) {
      // Web path: just download via html2pdf.
      emit({ stage: "saving", percent: 80, message: "Building PDF…" });
      await html2pdf().set(opt).from(container).save();
      return emit({
        stage: "done",
        percent: 100,
        message: "PDF saved to your Downloads folder.",
      });
    }

    // Native path: get base64, write to Documents, open via FileOpener.
    emit({ stage: "rendering", percent: 55, message: "Generating pages…" });
    const dataUri: string = await html2pdf()
      .set(opt)
      .from(container)
      .outputPdf("datauristring");

    if (signal?.()) {
      return emit({ stage: "error", percent: 0, message: "Cancelled", error: "cancelled" });
    }

    emit({ stage: "saving", percent: 80, message: "Saving to your device…" });

    const base64 = dataUriToBase64(dataUri);

    // Write to Cache directory to avoid storage permission issues
    const writeRes = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Cache,
      recursive: true,
    });

    try {
      await Share.share({
        title: title,
        url: writeRes.uri,
        dialogTitle: 'Save or Share PDF'
      });
    } catch (shareErr) {
      console.error("Share failed", shareErr);
    }

    return emit({
      stage: "done",
      percent: 100,
      message: "Ready to save or share.",
      filePath: writeRes.uri,
      fileUri: writeRes.uri,
    });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return emit({
      stage: "error",
      percent: 0,
      message: "Failed to generate PDF.",
      error: error?.message || String(error),
    });
  }
};

export const openExportedPDF = async (uri: string) => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    // We already shared it natively upon generation. If they click open again we can re-share
    await Share.share({ url: uri, dialogTitle: 'Save or Share PDF' });
  } catch (e) {
    console.error("Share failed", e);
    // fallback
    try {
      await FileOpener.open({
        filePath: uri,
        contentType: "application/pdf",
        openWithDefault: true,
      });
    } catch(openerErr) {
       console.error("Opener failed", openerErr);
       throw openerErr;
    }
  }
};

// Re-export Encoding for callers that may need raw text writes.
export { Encoding };
