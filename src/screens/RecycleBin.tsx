import React, { useState } from "react";
import { ArrowLeft, Trash2, RotateCcw, Layers, BookOpen, FileText, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext, RecycleBinItem } from "../context/AppContext";

type FilterTab = "all" | "deck" | "card" | "mock_test";

const RecycleBin = () => {
  const navigate = useNavigate();
  const { state, restoreFromBin, permanentlyDeleteFromBin, emptyRecycleBin } = useAppContext();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [confirmEmptyOpen, setConfirmEmptyOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const bin: RecycleBinItem[] = state.recycleBin || [];
  const retentionDays = state.user.recycleBinRetentionDays ?? 15;

  const filtered = activeTab === "all" ? bin : bin.filter(i => i.type === activeTab);

  const getDaysLeft = (deletedAt: string) => {
    const deleted = new Date(deletedAt).getTime();
    const expiry = deleted + retentionDays * 24 * 60 * 60 * 1000;
    const msLeft = expiry - Date.now();
    return Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
  };

  const getItemName = (item: RecycleBinItem) => {
    if (item.type === "deck") return (item.item as any).name;
    if (item.type === "mock_test") return (item.item as any).title;
    if (item.type === "card") return (item.item as any).front?.substring(0, 40) + ((item.item as any).front?.length > 40 ? "..." : "");
    return "Unknown";
  };

  const getItemSubtitle = (item: RecycleBinItem) => {
    if (item.type === "deck") return `${(item.item as any).cards?.length || 0} cards`;
    if (item.type === "mock_test") return `${(item.item as any).questions?.length || 0} questions`;
    if (item.type === "card") return item.deckName ? `From: ${item.deckName}` : "Flashcard";
    return "";
  };

  const typeIcon = (type: RecycleBinItem["type"]) => {
    if (type === "deck") return <Layers size={18} />;
    if (type === "mock_test") return <BookOpen size={18} />;
    return <FileText size={18} />;
  };

  const typeColor = (type: RecycleBinItem["type"]) => {
    if (type === "deck") return "text-violet-500 bg-violet-500/10";
    if (type === "mock_test") return "text-blue-500 bg-blue-500/10";
    return "text-teal-500 bg-teal-500/10";
  };

  const typeLabel = (type: RecycleBinItem["type"]) => {
    if (type === "deck") return "Deck";
    if (type === "mock_test") return "Test";
    return "Card";
  };

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "deck", label: "Decks" },
    { id: "card", label: "Cards" },
    { id: "mock_test", label: "Tests" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="min-h-screen font-display text-primary-fg flex flex-col pb-[calc(11rem+env(safe-area-inset-bottom))]"
    >
      <header
        className="sticky top-0 z-50 px-4 pb-2.5"
        style={{ paddingTop: `calc(env(safe-area-inset-top) + 6px)` }}
      >
        <div className="flex items-center gap-3 backdrop-blur-xl bg-elevated/60 border border-white/[0.08] shadow-md shadow-black/10 rounded-[1.35rem] px-3.5 py-2">
          <button onClick={() => navigate(-1)} className="size-10 rounded-2xl bg-white/35 dark:bg-white/8 border border-white/[0.10] shadow-sm flex items-center justify-center hover:bg-primary/10 transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl flex items-center justify-center bg-rose-500/15">
                <Trash2 size={17} className="text-rose-500" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight text-primary-fg">Recycle Bin</h1>
                <p className="text-[11px] text-tertiary-fg leading-none">{bin.length} item{bin.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            {bin.length > 0 && (
              <button
                onClick={() => setConfirmEmptyOpen(true)}
                className="text-xs font-bold text-rose-500 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
              >
                Empty
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Retention info */}
      <div className="px-4 pt-4">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
          <AlertTriangle size={15} className="text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Items are auto-deleted after <span className="font-bold">{retentionDays} day{retentionDays !== 1 ? "s" : ""}</span>. Restore them before they expire.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const count = tab.id === "all" ? bin.length : bin.filter(i => i.type === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-glow"
                  : "bg-surface-2 text-secondary-fg hover:bg-surface-3"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/25" : "bg-primary/15 text-primary"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <main className="flex-1 px-4 py-2 space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="size-20 rounded-3xl bg-surface-2 flex items-center justify-center">
                <Trash2 size={32} className="text-tertiary-fg" />
              </div>
              <p className="font-bold text-primary-fg text-lg">Bin is empty</p>
              <p className="text-sm text-tertiary-fg text-center max-w-xs">
                {activeTab === "all"
                  ? "Deleted items will appear here so you can restore them."
                  : `No deleted ${activeTab === "mock_test" ? "tests" : activeTab + "s"} in the bin.`}
              </p>
            </motion.div>
          ) : (
            filtered.map((item) => {
              const daysLeft = getDaysLeft(item.deletedAt);
              const isExpiringSoon = daysLeft <= 3;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="bg-elevated border border-subtle rounded-2xl p-4 flex items-center gap-3 shadow-card"
                >
                  <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${typeColor(item.type)}`}>
                    {typeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm text-primary-fg truncate">{getItemName(item)}</p>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-surface-2 text-tertiary-fg uppercase">
                        {typeLabel(item.type)}
                      </span>
                    </div>
                    <p className="text-xs text-tertiary-fg mt-0.5">{getItemSubtitle(item)}</p>
                    <p className={`text-[10px] font-bold mt-1 ${isExpiringSoon ? "text-rose-500" : "text-amber-500"}`}>
                      {daysLeft === 0 ? "Expires today" : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => { restoreFromBin(item.id); }}
                      className="size-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center hover:bg-emerald-500/25 transition-colors"
                      title="Restore"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="size-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500/20 transition-colors"
                      title="Delete permanently"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </main>

      {/* Confirm empty bin */}
      <AnimatePresence>
        {confirmEmptyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[260] flex items-end sm:items-center justify-center p-4 pb-[calc(7rem+env(safe-area-inset-bottom))]"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-elevated border border-subtle rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-card-lg"
            >
              <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <p className="text-center font-bold text-primary-fg text-lg">Empty Recycle Bin?</p>
              <p className="text-center text-sm text-secondary-fg">
                All {bin.length} item{bin.length !== 1 ? "s" : ""} will be permanently deleted. This cannot be undone.
              </p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setConfirmEmptyOpen(false)} className="flex-1 py-3 rounded-2xl font-bold bg-surface-2 text-secondary-fg">
                  Cancel
                </button>
                <button
                  onClick={() => { emptyRecycleBin(); setConfirmEmptyOpen(false); }}
                  className="flex-1 py-3 rounded-2xl font-bold bg-rose-500 text-white"
                >
                  Empty Bin
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm permanent delete single item */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[260] flex items-end sm:items-center justify-center p-4 pb-[calc(7rem+env(safe-area-inset-bottom))]"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-elevated border border-subtle rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-card-lg"
            >
              <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <p className="text-center font-bold text-primary-fg text-lg">Delete Permanently?</p>
              <p className="text-center text-sm text-secondary-fg">
                This item will be gone forever. This cannot be undone.
              </p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-3 rounded-2xl font-bold bg-surface-2 text-secondary-fg">
                  Cancel
                </button>
                <button
                  onClick={() => { permanentlyDeleteFromBin(confirmDeleteId); setConfirmDeleteId(null); }}
                  className="flex-1 py-3 rounded-2xl font-bold bg-rose-500 text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecycleBin;
