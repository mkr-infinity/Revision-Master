import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Minus,
  FileText,
} from "lucide-react";
import { Capacitor } from "@capacitor/core";
import {
  exportDecksToPDF,
  openExportedPDF,
  ExportProgress,
} from "../utils/pdfExport";
import { Deck } from "../context/AppContext";

interface ExportState {
  open: boolean;
  minimized: boolean;
  title: string;
  progress: ExportProgress;
}

interface PdfExportCtx {
  startExport: (decks: Deck[], title: string) => void;
}

const Ctx = createContext<PdfExportCtx | null>(null);

export const usePdfExport = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePdfExport must be used within PdfExportProvider");
  return v;
};

export const PdfExportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ExportState>({
    open: false,
    minimized: false,
    title: "",
    progress: { stage: "preparing", percent: 0, message: "" },
  });
  const cancelRef = useRef(false);

  const startExport = useCallback((decks: Deck[], title: string) => {
    cancelRef.current = false;
    setState({
      open: true,
      minimized: false,
      title,
      progress: {
        stage: "preparing",
        percent: 2,
        message: "Preparing your notebook…",
      },
    });

    exportDecksToPDF(decks, title, {
      signal: () => cancelRef.current,
      onProgress: (progress) =>
        setState((s) => ({
          ...s,
          progress,
        })),
    }).catch((err) => {
      setState((s) => ({
        ...s,
        progress: {
          stage: "error",
          percent: 0,
          message: "Something went wrong.",
          error: err?.message || String(err),
        },
      }));
    });
  }, []);

  const cancel = () => {
    cancelRef.current = true;
    setState((s) => ({ ...s, open: false, minimized: false }));
  };

  const close = () =>
    setState((s) => ({ ...s, open: false, minimized: false }));

  const minimize = () => setState((s) => ({ ...s, minimized: true }));
  const restore = () => setState((s) => ({ ...s, minimized: false }));

  const handleOpenFile = async () => {
    if (state.progress.fileUri) {
      try {
        await openExportedPDF(state.progress.fileUri);
      } catch {
        /* swallow */
      }
    }
  };

  const value = useMemo(() => ({ startExport }), [startExport]);

  const { open, minimized, title, progress } = state;
  const isDone = progress.stage === "done";
  const isError = progress.stage === "error";
  const isWorking = !isDone && !isError;
  const native = Capacitor.isNativePlatform();
  const fillPct = Math.max(0, Math.min(100, progress.percent));

  return (
    <Ctx.Provider value={value}>
      {children}

      {/* Floating restore pill when minimized */}
      <AnimatePresence>
        {open && minimized && (
          <motion.button
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            onClick={restore}
            className="fixed z-[300] left-1/2 -translate-x-1/2 bottom-28 px-4 py-2.5 rounded-full bg-[var(--color-primary)] text-white shadow-glow flex items-center gap-2 font-bold text-sm"
            style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom) / 2)" }}
          >
            <FileText size={16} />
            <span>{isDone ? "PDF ready" : isError ? "Export failed" : `Exporting… ${fillPct}%`}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full progress modal */}
      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className="w-full max-w-sm bg-elevated border border-subtle rounded-3xl shadow-card-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-subtle">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`size-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isError
                        ? "bg-rose-500/15 text-rose-500"
                        : isDone
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
                    }`}
                  >
                    {isError ? (
                      <AlertTriangle size={20} />
                    ) : isDone ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <Download size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm leading-tight truncate">
                      {isError
                        ? "Export failed"
                        : isDone
                          ? "PDF ready"
                          : "Building your PDF"}
                    </h3>
                    <p className="text-[11px] text-tertiary-fg leading-snug truncate">
                      {title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {isWorking && (
                    <button
                      onClick={minimize}
                      className="p-1.5 rounded-lg hover:bg-surface-2 text-tertiary-fg"
                      aria-label="Hide"
                    >
                      <Minus size={16} />
                    </button>
                  )}
                  <button
                    onClick={close}
                    className="p-1.5 rounded-lg hover:bg-surface-2 text-tertiary-fg"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Glass-of-water progress */}
              <div className="px-6 py-5 flex flex-col items-center gap-4">
                <div
                  className="relative w-28 h-36 rounded-b-[34px] rounded-t-[14px] border-2 overflow-hidden bg-surface-1"
                  style={{
                    borderColor: isError
                      ? "rgba(244,63,94,0.4)"
                      : "rgba(127,19,236,0.35)",
                  }}
                >
                  <motion.div
                    className="absolute inset-x-0 bottom-0"
                    animate={{ height: `${fillPct}%` }}
                    transition={{ type: "spring", stiffness: 70, damping: 18 }}
                    style={{
                      background: isError
                        ? "linear-gradient(180deg, #fecdd3, #f43f5e)"
                        : isDone
                          ? "linear-gradient(180deg, #6ee7b7, #10b981)"
                          : "linear-gradient(180deg, #c4b5fd, #7c3aed)",
                    }}
                  >
                    {/* surface ripple */}
                    <motion.div
                      className="absolute -top-1 inset-x-0 h-2 opacity-70"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, transparent 70%)",
                      }}
                      animate={{ x: [-10, 10, -10] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>

                  {/* glass shine */}
                  <div className="absolute top-2 left-2 w-2 h-20 rounded-full bg-white/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-primary-fg drop-shadow-md mix-blend-difference">
                      {Math.round(fillPct)}%
                    </span>
                  </div>
                </div>

                <p className="text-center text-sm text-secondary-fg leading-snug min-h-[40px]">
                  {progress.message ||
                    (isWorking ? "Working on it…" : isDone ? "All done!" : "")}
                </p>
                {progress.error && (
                  <p className="text-[11px] text-rose-500 text-center break-all">
                    {progress.error}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 flex gap-2">
                {isWorking ? (
                  <>
                    <button
                      onClick={minimize}
                      className="flex-1 py-3 rounded-2xl font-bold bg-surface-2 text-secondary-fg active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Minus size={16} /> Hide
                    </button>
                    <button
                      onClick={cancel}
                      className="flex-1 py-3 rounded-2xl font-bold bg-rose-500/10 text-rose-500 active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </>
                ) : isDone ? (
                  <>
                    {native && progress.fileUri && (
                      <button
                        onClick={handleOpenFile}
                        className="flex-1 py-3 rounded-2xl font-bold gradient-violet text-white shadow-glow active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <FolderOpen size={16} /> Open
                      </button>
                    )}
                    <button
                      onClick={close}
                      className={`${native && progress.fileUri ? "flex-1" : "w-full"} py-3 rounded-2xl font-bold bg-surface-2 text-secondary-fg active:scale-[0.98]`}
                    >
                      Done
                    </button>
                  </>
                ) : (
                  <button
                    onClick={close}
                    className="w-full py-3 rounded-2xl font-bold bg-surface-2 text-secondary-fg active:scale-[0.98]"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
};

export default PdfExportProvider;
