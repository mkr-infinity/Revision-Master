import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  PlusCircle,
  FunctionSquare,
  Trash2,
  Edit2,
  ArrowLeft,
  Save,
  X,
  Image as ImageIcon,
  FileText,
  Palette,
  Sparkles,
  Loader2,
  Layers,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Plus,
  Pin,
  ChevronDown,
  Search,
  Download
} from "lucide-react";
import { useAppContext, Deck, Card } from "../context/AppContext";
import { GoogleGenAI, Type } from "@google/genai";
import { exportDecksToPDF } from "../utils/pdfExport";

const cardThemes = [
  { id: "default", name: "Default", color: "bg-white dark:bg-slate-900" },
  { id: "blue", name: "Blue", color: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "green", name: "Green", color: "bg-emerald-50 dark:bg-emerald-900/20" },
  { id: "yellow", name: "Yellow", color: "bg-amber-50 dark:bg-amber-900/20" },
  { id: "purple", name: "Purple", color: "bg-purple-50 dark:bg-purple-900/20" },
  { id: "rose", name: "Rose", color: "bg-rose-50 dark:bg-rose-900/20" },
];

const deckGradients = [
  { id: "grad1", name: "Ocean", class: "bg-gradient-to-br from-blue-500 to-indigo-600" },
  { id: "grad2", name: "Forest", class: "bg-gradient-to-br from-emerald-400 to-teal-600" },
  { id: "grad3", name: "Sunset", class: "bg-gradient-to-br from-orange-400 to-rose-500" },
  { id: "grad4", name: "Berry", class: "bg-gradient-to-br from-fuchsia-500 to-purple-600" },
  { id: "grad5", name: "Midnight", class: "bg-gradient-to-br from-slate-800 to-slate-900" },
  { id: "grad6", name: "Gold", class: "bg-gradient-to-br from-amber-400 to-orange-500" },
];

import AppLogo from "../components/AppLogo";

const Flashcards = () => {
  const { state, addDeck, updateDeck, deleteDeck, logActivity } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"flashcards" | "formulas">("flashcards");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  
  // Card Form State
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [newCardTheme, setNewCardTheme] = useState("default");
  const [newCardImage, setNewCardImage] = useState("");
  const [newCardShowImageOnFront, setNewCardShowImageOnFront] = useState(false);
  const [newCardNotes, setNewCardNotes] = useState("");
  const [showAdvancedCardOptions, setShowAdvancedCardOptions] = useState(false);

  // Modal State
  const [modalType, setModalType] = useState<"none" | "createDeck" | "editDeck" | "deleteDeck" | "deleteCard" | "aiGenerate">("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    let shouldClearState = false;
    
    if (location.state?.openAiModal) {
      setModalType("aiGenerate");
      shouldClearState = true;
    }
    
    if (location.state?.selectedDeckId) {
      const deck = state.decks.find(d => d.id === location.state.selectedDeckId);
      if (deck) {
        setSelectedDeck(deck);
        setActiveTab(deck.type === "formula" ? "formulas" : "flashcards");
      }
      shouldClearState = true;
    }

    if (shouldClearState) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, state.decks, location.pathname, navigate]);
  const [modalDeckId, setModalDeckId] = useState<string>("");
  const [modalDeckName, setModalDeckName] = useState<string>("");
  const [modalDeckTheme, setModalDeckTheme] = useState<string>("default");
  const [modalDeckGradient, setModalDeckGradient] = useState<string>("grad1");
  const [modalDeckColor1, setModalDeckColor1] = useState<string>("#7f13ec");
  const [modalDeckColor2, setModalDeckColor2] = useState<string>("#0ea5e9");
  const [useCustomGradient, setUseCustomGradient] = useState<boolean>(false);
  const [modalCardId, setModalCardId] = useState<string>("");
  const [expandedDeckId, setExpandedDeckId] = useState<string | null>(null);

  // Study Modal State
  const [studyCard, setStudyCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyDeck, setStudyDeck] = useState<Card[]>([]);
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);
  const [isStudyComplete, setIsStudyComplete] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  const startStudySession = (deck: Deck, startCard?: Card) => {
    const cards = [...deck.cards];
    setStudyDeck(cards);
    const startIndex = startCard ? cards.findIndex(c => c.id === startCard.id) : 0;
    setCurrentStudyIndex(startIndex >= 0 ? startIndex : 0);
    setStudyCard(cards[startIndex >= 0 ? startIndex : 0] || null);
    setIsFlipped(false);
    setIsStudyComplete(false);
    setSwipeDirection(null);
  };

  const handleNextCard = (mastered: boolean) => {
    setSwipeDirection(mastered ? "right" : "left");
    
    setTimeout(() => {
      if (currentStudyIndex < studyDeck.length - 1) {
        const nextIndex = currentStudyIndex + 1;
        setCurrentStudyIndex(nextIndex);
        setStudyCard(studyDeck[nextIndex]);
        setIsFlipped(false);
        setSwipeDirection(null);
      } else {
        setIsStudyComplete(true);
      }
    }, 300);
  };

  // AI State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [numCardsToGenerate, setNumCardsToGenerate] = useState<number | "custom">(5);
  const [customNumCards, setCustomNumCards] = useState<number>(20);

  const handleCreateDeck = () => {
    setModalDeckName("");
    setModalDeckTheme("default");
    setModalDeckGradient("grad1");
    setUseCustomGradient(false);
    setModalDeckColor1("#7f13ec");
    setModalDeckColor2("#0ea5e9");
    setModalType("createDeck");
  };

  const confirmCreateDeck = () => {
    if (modalDeckName.trim()) {
      const gradient = useCustomGradient 
        ? `linear-gradient(to bottom right, ${modalDeckColor1}, ${modalDeckColor2})`
        : (deckGradients.find(g => g.id === modalDeckGradient)?.class || deckGradients[0].class);
      
      addDeck({
        id: Date.now().toString(),
        name: modalDeckName.trim(),
        type: activeTab === "flashcards" ? "flashcard" : "formula",
        theme: modalDeckTheme,
        gradient: gradient,
        cards: []
      });
      logActivity({
        type: "added",
        itemType: "deck",
        itemName: modalDeckName.trim(),
      });
      setModalType("none");
    }
  };

  const handleTogglePinDeck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const deck = state.decks.find((d) => d.id === id);
    if (deck) {
      updateDeck(id, { isPinned: !deck.isPinned });
    }
  };

  const handleDeleteDeck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalDeckId(id);
    setModalType("deleteDeck");
  };

  const confirmDeleteDeck = () => {
    const deckToDelete = state.decks.find(d => d.id === modalDeckId);
    if (deckToDelete) {
      logActivity({
        type: "removed",
        itemType: "deck",
        itemName: deckToDelete.name,
      });
    }
    deleteDeck(modalDeckId);
    setModalType("none");
  };

  const handleEditDeckName = (deck: Deck, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalDeckId(deck.id);
    setModalDeckName(deck.name);
    setModalDeckTheme(deck.theme || "default");
    
    const isCustom = deck.gradient?.startsWith("linear-gradient");
    setUseCustomGradient(!!isCustom);
    
    if (isCustom) {
      const colors = deck.gradient!.match(/#[a-fA-F0-9]{6}|rgb\([^)]+\)/g);
      if (colors && colors.length >= 2) {
        setModalDeckColor1(colors[0]);
        setModalDeckColor2(colors[1]);
      }
    } else {
      const foundGrad = deckGradients.find(g => g.class === deck.gradient);
      setModalDeckGradient(foundGrad ? foundGrad.id : "grad1");
    }
    
    setExpandedDeckId(null);
    setModalType("editDeck");
  };

  const confirmEditDeck = () => {
    if (modalDeckName.trim()) {
      const gradient = useCustomGradient 
        ? `linear-gradient(to bottom right, ${modalDeckColor1}, ${modalDeckColor2})`
        : (deckGradients.find(g => g.id === modalDeckGradient)?.class || deckGradients[0].class);

      updateDeck(modalDeckId, { 
        name: modalDeckName.trim(), 
        theme: modalDeckTheme,
        gradient: gradient
      });
      logActivity({
        type: "edited",
        itemType: "deck",
        itemName: modalDeckName.trim(),
      });
      setModalType("none");
    }
  };

  const resetCardForm = () => {
    setNewCardFront("");
    setNewCardBack("");
    setNewCardTheme("default");
    setNewCardImage("");
    setNewCardShowImageOnFront(false);
    setNewCardNotes("");
    setEditingCard(null);
    setShowAdvancedCardOptions(false);
  };

  const handleAddCard = () => {
    if (!selectedDeck) return;
    const currentDeck = state.decks.find(d => d.id === selectedDeck.id);
    if (!currentDeck) return;

    if (!newCardFront.trim() || !newCardBack.trim()) {
      alert("Please fill in both front and back of the card.");
      return;
    }

    const newCard: Card = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      front: newCardFront,
      back: newCardBack,
      theme: newCardTheme,
      image: newCardImage,
      showImageOnFront: newCardShowImageOnFront,
      notes: newCardNotes
    };

    updateDeck(currentDeck.id, {
      cards: [...currentDeck.cards, newCard]
    });

    logActivity({
      type: "added",
      itemType: "card",
      itemName: newCardFront.substring(0, 20) + (newCardFront.length > 20 ? "..." : ""),
    });

    resetCardForm();
  };

  const startEditCard = (card: Card) => {
    setEditingCard(card);
    setNewCardFront(card.front);
    setNewCardBack(card.back);
    setNewCardTheme(card.theme || "default");
    setNewCardImage(card.image || "");
    setNewCardShowImageOnFront(card.showImageOnFront || false);
    setNewCardNotes(card.notes || "");
    setShowAdvancedCardOptions(!!(card.theme && card.theme !== "default") || !!card.image || !!card.notes);
  };

  const handleUpdateCard = () => {
    if (!selectedDeck || !editingCard) return;
    const currentDeck = state.decks.find(d => d.id === selectedDeck.id);
    if (!currentDeck) return;

    if (!newCardFront.trim() || !newCardBack.trim()) {
      alert("Please fill in both front and back of the card.");
      return;
    }

    const updatedCard: Card = {
      ...editingCard,
      front: newCardFront,
      back: newCardBack,
      theme: newCardTheme,
      image: newCardImage,
      showImageOnFront: newCardShowImageOnFront,
      notes: newCardNotes
    };

    updateDeck(currentDeck.id, {
      cards: currentDeck.cards.map(c => c.id === editingCard.id ? updatedCard : c)
    });

    logActivity({
      type: "edited",
      itemType: "card",
      itemName: newCardFront.substring(0, 20) + (newCardFront.length > 20 ? "..." : ""),
    });

    resetCardForm();
  };

  const handleDeleteCard = (cardId: string) => {
    setModalCardId(cardId);
    setModalType("deleteCard");
  };

  const confirmDeleteCard = () => {
    if (!selectedDeck) return;
    const currentDeck = state.decks.find(d => d.id === selectedDeck.id);
    if (!currentDeck) return;

    const cardToDelete = currentDeck.cards.find(c => c.id === modalCardId);
    if (cardToDelete) {
      logActivity({
        type: "removed",
        itemType: "card",
        itemName: cardToDelete.front.substring(0, 20) + (cardToDelete.front.length > 20 ? "..." : ""),
      });
    }

    updateDeck(currentDeck.id, {
      cards: currentDeck.cards.filter(c => c.id !== modalCardId)
    });
    setModalType("none");
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    
    const actualNumCards = numCardsToGenerate === "custom" ? customNumCards : numCardsToGenerate;
    if (actualNumCards < 1 || actualNumCards > 100) {
      alert("Please select a number of cards between 1 and 100.");
      return;
    }

    setIsGenerating(true);
    
    try {
      const apiKeyToUse = state.user.customApiKey?.trim() || process.env.GEMINI_API_KEY;
      if (!apiKeyToUse) {
        alert("Gemini API key is missing. Please go to Settings to add your API key.");
        setIsGenerating(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: apiKeyToUse });
      const currentDeck = selectedDeck ? state.decks.find(d => d.id === selectedDeck.id) : null;
      const isFormula = currentDeck?.type === "formula" || activeTab === "formulas";

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate exactly ${actualNumCards} flashcards about: ${aiPrompt}. ${isFormula ? 'These should be math or physics formulas.' : 'These are general study flashcards.'}`,
        config: {
          systemInstruction: "You are MKR Ai, an AI assistant for Revision Master. Do not say you are made by Google. Generate high-quality flashcards.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING, description: "The question or term on the front of the card." },
                back: { type: Type.STRING, description: "The answer or definition on the back of the card." },
                notes: { type: Type.STRING, description: "Any extra context or hints (optional)." }
              },
              required: ["front", "back"]
            }
          }
        }
      });

      let jsonStr = response.text?.trim() || "";
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.substring(7);
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.substring(3);
      }
      if (jsonStr.endsWith("```")) {
        jsonStr = jsonStr.substring(0, jsonStr.length - 3);
      }
      jsonStr = jsonStr.trim();

      if (jsonStr) {
        const generatedCards = JSON.parse(jsonStr);
        const newCards: Card[] = generatedCards.map((c: any) => ({
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          front: c.front,
          back: c.back,
          notes: c.notes || "",
          theme: "default",
          image: ""
        }));

        if (currentDeck) {
          updateDeck(currentDeck.id, {
            cards: [...currentDeck.cards, ...newCards]
          });
          logActivity({
            type: "added",
            itemType: "card",
            itemName: `Generated ${newCards.length} cards with MKR Ai`,
          });
        } else {
          const newDeck: Deck = {
            id: Date.now().toString(),
            name: `${aiPrompt.substring(0, 20)}${aiPrompt.length > 20 ? '...' : ''} (AI)`,
            type: activeTab === "formulas" ? "formula" : "flashcard",
            theme: "default",
            cards: newCards
          };
          addDeck(newDeck);
          logActivity({
            type: "added",
            itemType: "deck",
            itemName: newDeck.name,
          });
          setSelectedDeck(newDeck);
        }
        setModalType("none");
        setAiPrompt("");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate cards. Please check your API key and internet connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCardImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const mainContent = selectedDeck ? (() => {
    const currentDeck = state.decks.find(d => d.id === selectedDeck.id);
    if (!currentDeck) {
      setSelectedDeck(null);
      return null;
    }

    return (
      <>
        <header className="p-4 pt-6 sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={() => {
                setSelectedDeck(null);
                setSearchQuery("");
                setIsSearchOpen(false);
              }}
              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold leading-none">
                {currentDeck.name}
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                {currentDeck.cards.length} Cards
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-lg transition-colors ${isSearchOpen ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary'}`}
                title="Search Cards"
              >
                <Search size={18} />
              </button>
              <button 
                onClick={(e) => handleTogglePinDeck(currentDeck.id, e)}
                className={`p-2 rounded-lg transition-colors ${currentDeck.isPinned ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary'}`}
                title={currentDeck.isPinned ? "Unpin Deck" : "Pin Deck"}
              >
                <Pin size={18} fill={currentDeck.isPinned ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  exportDecksToPDF([currentDeck], currentDeck.name);
                }}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
                title="Export Deck as PDF"
              >
                <Download size={18} />
              </button>
              <button 
                onClick={(e) => handleEditDeckName(currentDeck, e)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
                title="Edit Deck"
              >
                <Edit2 size={18} />
              </button>
            </div>
          </div>
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="relative pt-2 pb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 mt-1 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search cards in this deck..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className="flex-1 px-4 py-6">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
            <h3 className="font-bold mb-3">{editingCard ? "Edit Card" : "Add New Card"}</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Front (Question/Term)"
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
              <textarea
                placeholder="Back (Answer/Definition)"
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none min-h-[80px] resize-none"
              />

              <div className="pt-2 border-t border-primary/10">
                <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <ImageIcon size={12} /> Image (Optional)
                </label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL or choose file..."
                      value={newCardImage}
                      onChange={(e) => setNewCardImage(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                    <label className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center transition-colors">
                      Upload
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                    </label>
                  </div>
                  
                  {newCardImage && (
                    <div className="flex items-center justify-between bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="size-10 rounded overflow-hidden border border-slate-200 dark:border-slate-800">
                          <img src={newCardImage} alt="Preview" className="size-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-400">Image added</span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-[10px] font-bold uppercase text-slate-500">Show on front</span>
                        <input 
                          type="checkbox" 
                          checked={newCardShowImageOnFront}
                          onChange={(e) => setNewCardShowImageOnFront(e.target.checked)}
                          className="size-4 accent-primary"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              {showAdvancedCardOptions && (
                <div className="space-y-3 pt-2 border-t border-primary/10">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <Palette size={12} /> Card Theme
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {cardThemes.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setNewCardTheme(theme.id)}
                          className={`size-8 rounded-full border-2 flex-shrink-0 ${theme.color} ${newCardTheme === theme.id ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'}`}
                          title={theme.name}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <FileText size={12} /> Extra Notes (Optional)
                    </label>
                    <textarea
                      placeholder="Additional context or hints..."
                      value={newCardNotes}
                      onChange={(e) => setNewCardNotes(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none min-h-[60px] resize-none"
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={() => setShowAdvancedCardOptions(!showAdvancedCardOptions)}
                className="text-xs font-bold text-primary hover:underline"
              >
                {showAdvancedCardOptions ? "- Hide Advanced Options" : "+ Show Advanced Options (Theme, Notes)"}
              </button>

              <div className="flex gap-2 pt-2">
                {editingCard ? (
                  <>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUpdateCard}
                      className="flex-1 bg-primary text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <Save size={16} /> Save Changes
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={resetCardForm}
                      className="px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 py-2.5 rounded-lg font-bold text-sm"
                    >
                      Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddCard}
                    className="w-full bg-primary text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={16} /> Add Card
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold mb-3">Cards in Deck</h3>
            {currentDeck.cards.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-8 bg-primary/5 rounded-xl border border-primary/10 border-dashed">
                No cards yet. Add one above!
              </p>
            ) : (
              currentDeck.cards
                .filter(c => {
                  if (!searchQuery.trim()) return true;
                  const query = searchQuery.toLowerCase();
                  return c.front.toLowerCase().includes(query) || c.back.toLowerCase().includes(query) || (c.notes && c.notes.toLowerCase().includes(query));
                })
                .map((card) => {
                const themeClass = cardThemes.find(t => t.id === card.theme)?.color || cardThemes[0].color;
                return (
                <div 
                  key={card.id} 
                  onClick={() => {
                    startStudySession(currentDeck, card);
                  }}
                  className={`${themeClass} border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-base text-slate-800 dark:text-slate-100 selectable">{card.front}</p>
                    <div className="flex items-center gap-1.5 ml-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedCards = currentDeck.cards.map(c => 
                            c.id === card.id ? { ...c, isPinned: !c.isPinned } : c
                          );
                          updateDeck(currentDeck.id, { cards: updatedCards });
                        }}
                        className={`p-2 transition-colors bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black rounded-lg ${card.isPinned ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
                      >
                        <Pin size={16} fill={card.isPinned ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedCards = currentDeck.cards.map(c => 
                            c.id === card.id ? { ...c, isFavourite: !c.isFavourite } : c
                          );
                          updateDeck(currentDeck.id, { cards: updatedCards });
                        }}
                        className={`p-2 transition-colors bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black rounded-lg ${card.isFavourite ? 'text-amber-500' : 'text-slate-500 hover:text-amber-500'}`}
                      >
                        <Star size={16} className={card.isFavourite ? "fill-current" : ""} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditCard(card);
                        }}
                        className="p-2 text-slate-700 dark:text-slate-400 hover:text-primary transition-colors bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card.id);
                        }}
                        className="p-2 text-slate-700 dark:text-slate-400 hover:text-red-500 transition-colors bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {card.image && (
                    <div className="my-4 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                      <img src={card.image} alt="Card attachment" className="w-full h-auto max-h-48 object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="w-full h-px bg-slate-200/60 dark:bg-slate-700/60 my-3"></div>
                  <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed selectable">{card.back}</p>
                  {card.notes && (
                    <div className="mt-4 p-3 bg-white/60 dark:bg-black/30 rounded-xl text-xs text-slate-700 dark:text-slate-400 italic border border-slate-100 dark:border-slate-800">
                      {card.notes}
                    </div>
                  )}
                </div>
              )})
            )}
          </div>
        </main>
      </>
    );
  })() : (
    <>
      <header className="p-4 pt-6 sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 border border-primary/20">
              <AppLogo className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tight leading-none">
                REVISION<span className="text-primary not-italic">MASTER</span>
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                MKR Revision App
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2.5 rounded-xl transition-all border shadow-sm ${isSearchOpen ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              title="Search Decks"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => setModalType("aiGenerate")}
              className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-all border border-purple-500/20 shadow-sm"
              title="Generate with MKR Ai"
            >
              <Sparkles size={20} />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="relative pt-2 pb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 mt-1 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search decks and cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 px-4 py-6">
        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6 border border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('flashcards')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'flashcards' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500'}`}
          >
            <Layers size={18} /> Flashcards
          </button>
          <button 
            onClick={() => setActiveTab('formulas')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'formulas' ? 'bg-white dark:bg-slate-800 text-teal-500 shadow-sm' : 'text-slate-500'}`}
          >
            <FunctionSquare size={18} /> Formulas
          </button>
        </div>

        {/* Deck List */}
        <div className={`grid gap-3 sm:gap-4 ${state.user.decksLayout === 'list' ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalType("createDeck")}
            className="group relative overflow-hidden bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary/40 transition-all"
            style={{ minHeight: `${140 * (state.user.decksSize || 1)}px` }}
          >
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <span className="font-bold text-primary text-sm text-center">New Deck</span>
          </motion.button>

          {state.decks
            .filter(d => d.type === (activeTab === 'flashcards' ? 'flashcard' : 'formula'))
            .filter(d => {
              if (!searchQuery.trim()) return true;
              const query = searchQuery.toLowerCase();
              if (d.name.toLowerCase().includes(query)) return true;
              return d.cards.some(c => c.front.toLowerCase().includes(query) || c.back.toLowerCase().includes(query) || (c.notes && c.notes.toLowerCase().includes(query)));
            })
            .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
            .map((deck) => {
            const isExpanded = expandedDeckId === deck.id;
            const isCustomGradient = deck.gradient?.startsWith("linear-gradient");
            return (
              <motion.div 
                whileTap={{ scale: 0.98 }}
                key={deck.id}
                onClick={() => setSelectedDeck(deck)}
                className={`group relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col ${!isCustomGradient ? deck.gradient : ''}`}
                style={{ 
                  background: isCustomGradient ? deck.gradient : undefined,
                  minHeight: `${140 * (state.user.decksSize || 1)}px`
                }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-3 flex flex-col h-full text-white">
                  <div className="flex justify-between items-start mb-2">
                    <div className="size-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                      {activeTab === 'flashcards' ? <Layers size={16} /> : <FunctionSquare size={16} />}
                    </div>
                    <div className="flex items-center gap-1">
                      {deck.isPinned && (
                        <div className="p-1 rounded-full bg-white/20 backdrop-blur-md">
                          <Pin size={10} fill="currentColor" />
                        </div>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedDeckId(isExpanded ? null : deck.id);
                        }}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
                      >
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1 group-hover:underline decoration-white/30 underline-offset-2">
                      {deck.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
                        {deck.cards.length} Cards
                      </span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/20 flex flex-col gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleTogglePinDeck(deck.id, e); setExpandedDeckId(null); }}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                        >
                          <Pin size={12} fill={deck.isPinned ? "currentColor" : "none"} />
                          {deck.isPinned ? "Unpin" : "Pin"}
                        </button>
                        <button 
                          onClick={(e) => handleEditDeckName(deck, e)}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                        >
                          <Edit2 size={12} />
                          Edit
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); exportDecksToPDF([deck], deck.name); setExpandedDeckId(null); }}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                        >
                          <Download size={12} />
                          Export PDF
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteDeck(deck.id, e); setExpandedDeckId(null); }}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-red-500/40 hover:bg-red-500/60 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="font-display text-slate-900 dark:text-slate-100 flex flex-col pb-24"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDeck ? "deck-view" : "deck-list"}
          initial={{ opacity: 0, x: selectedDeck ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: selectedDeck ? -20 : 20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          {mainContent}
        </motion.div>
      </AnimatePresence>

      {/* Study Modal */}
      <AnimatePresence>
      {studyCard && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-background-light dark:bg-background-dark border border-primary/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[750px]"
          >
            <div className="flex items-center justify-between p-4 border-b border-primary/10">
              <div className="flex items-center gap-2">
                <div className={`size-8 rounded flex items-center justify-center ${activeTab === 'flashcards' ? 'bg-primary/10 text-primary' : 'bg-teal-500/10 text-teal-500'}`}>
                  {activeTab === 'flashcards' ? <Layers size={16} /> : <FunctionSquare size={16} />}
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">
                    {isStudyComplete ? "Session Complete!" : "Quick Review"}
                  </h3>
                  {!isStudyComplete && (
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Card {currentStudyIndex + 1} of {studyDeck.length}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isStudyComplete && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedDeck) {
                          const updatedCards = selectedDeck.cards.map(c => 
                            c.id === studyCard.id ? { ...c, isPinned: !c.isPinned } : c
                          );
                          updateDeck(selectedDeck.id, { cards: updatedCards });
                          setStudyCard({ ...studyCard, isPinned: !studyCard.isPinned });
                        }
                      }}
                      className={`p-1 rounded-lg transition-colors ${studyCard.isPinned ? 'text-primary hover:bg-primary/10' : 'text-slate-400 hover:bg-slate-500/10'}`}
                    >
                      <Pin size={20} fill={studyCard.isPinned ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedDeck) {
                          const updatedCards = selectedDeck.cards.map(c => 
                            c.id === studyCard.id ? { ...c, isFavourite: !c.isFavourite } : c
                          );
                          updateDeck(selectedDeck.id, { cards: updatedCards });
                          setStudyCard({ ...studyCard, isFavourite: !studyCard.isFavourite });
                        }
                      }}
                      className={`p-1 rounded-lg transition-colors ${studyCard.isFavourite ? 'text-amber-500 hover:bg-amber-500/10' : 'text-slate-400 hover:bg-slate-500/10'}`}
                    >
                      <Star size={20} className={studyCard.isFavourite ? "fill-current" : ""} />
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setStudyCard(null)}
                  className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isStudyComplete ? (
                  <motion.div 
                    key="complete"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center space-y-6"
                  >
                    <div className="size-24 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 size={48} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black italic text-primary mb-2">GREAT JOB!</h2>
                      <p className="text-slate-700 dark:text-slate-400">You've reviewed all cards in this deck.</p>
                    </div>
                    <div className="flex gap-3 w-full max-w-[200px]">
                      <button 
                        onClick={() => startStudySession(selectedDeck!)}
                        className="flex-1 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30"
                      >
                        Review Again
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={studyCard.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 100) handleNextCard(true);
                      else if (info.offset.x < -100) handleNextCard(false);
                    }}
                    animate={{ 
                      x: swipeDirection === "right" ? 500 : swipeDirection === "left" ? -500 : 0,
                      opacity: swipeDirection ? 0 : 1,
                      rotate: swipeDirection === "right" ? 20 : swipeDirection === "left" ? -20 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full h-full flex flex-col items-center justify-center perspective-1000"
                  >
                    <div 
                      className={`w-full h-full transition-all duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''} shadow-2xl rounded-2xl relative`}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-inner overflow-y-auto">
                        <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mb-6">Question</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{studyCard.front}</h2>
                        {studyCard.image && studyCard.showImageOnFront && (
                          <div className="mt-6 w-full max-h-60 rounded-xl overflow-hidden border-2 border-primary/20 shadow-md">
                            <img src={studyCard.image} alt="Card visual" className="w-full h-full object-contain bg-white/50 dark:bg-black/50" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <div className="mt-auto pt-6 flex items-center gap-2 text-slate-400">
                          <RefreshCw size={14} className="animate-spin-slow" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Tap to Flip</span>
                        </div>
                      </div>
                      
                      {/* Back */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-inner overflow-y-auto">
                        <p className="text-xs text-primary font-black uppercase tracking-[0.2em] mb-6">Answer</p>
                        <h2 className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed">{studyCard.back}</h2>
                        {studyCard.image && !studyCard.showImageOnFront && (
                          <div className="mt-6 w-full max-h-60 rounded-xl overflow-hidden border-2 border-primary/20 shadow-md">
                            <img src={studyCard.image} alt="Card visual" className="w-full h-full object-contain bg-white/50 dark:bg-black/50" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        {studyCard.notes && (
                          <div className="mt-6 p-4 bg-white/60 dark:bg-black/40 rounded-xl text-sm italic text-slate-700 dark:text-slate-400 w-full border border-primary/10 shadow-sm">
                            {studyCard.notes}
                          </div>
                        )}
                        <div className="mt-auto pt-6 flex items-center gap-2 text-primary/60">
                          <RefreshCw size={14} className="animate-spin-slow" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Tap to Flip</span>
                        </div>
                      </div>
                    </div>

                    {/* Swipe Indicators */}
                    <div className="absolute inset-x-0 bottom-0 flex justify-between px-8 pb-4 pointer-events-none opacity-40">
                      <div className="flex flex-col items-center gap-1">
                        <ArrowLeft size={16} />
                        <span className="text-[8px] font-bold uppercase">Review</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-bold uppercase">Mastered</span>
                        <ArrowLeft size={16} className="rotate-180" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isStudyComplete && (
              <div className="p-4 border-t border-primary/10 flex gap-3">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNextCard(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 flex items-center justify-center gap-2 text-sm border border-slate-200 dark:border-slate-700"
                >
                  <XCircle size={18} /> Needs Review
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNextCard(true)}
                  className="flex-1 py-3 rounded-xl font-bold bg-emerald-500 text-white flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 size={18} /> Mastered
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
      {modalType !== "none" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-background-light dark:bg-background-dark border border-primary/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-primary/10">
              <h3 className="font-bold text-lg">
                {modalType === "createDeck" && "Create New Deck"}
                {modalType === "editDeck" && "Rename Deck"}
                {modalType === "deleteDeck" && "Delete Deck"}
                {modalType === "deleteCard" && "Delete Card"}
                {modalType === "aiGenerate" && "Generate with MKR Ai"}
              </h3>
              <button 
                onClick={() => setModalType("none")}
                className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {(modalType === "createDeck" || modalType === "editDeck") && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Deck Name</label>
                    <input 
                      type="text" 
                      value={modalDeckName}
                      onChange={(e) => setModalDeckName(e.target.value)}
                      placeholder="e.g. Physics Chapter 1"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Theme</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {cardThemes.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setModalDeckTheme(theme.id)}
                          className={`size-8 rounded-full border-2 flex-shrink-0 ${theme.color} ${modalDeckTheme === theme.id ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'}`}
                          title={theme.name}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Deck Background</label>
                      <button 
                        onClick={() => setUseCustomGradient(!useCustomGradient)}
                        className="text-[10px] font-bold text-primary uppercase hover:underline"
                      >
                        {useCustomGradient ? "Use Presets" : "Custom Gradient"}
                      </button>
                    </div>
                    
                    {useCustomGradient ? (
                      <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Color 1</span>
                            <input 
                              type="color" 
                              value={modalDeckColor1}
                              onChange={(e) => setModalDeckColor1(e.target.value)}
                              className="size-6 rounded cursor-pointer bg-transparent border-none"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Color 2</span>
                            <input 
                              type="color" 
                              value={modalDeckColor2}
                              onChange={(e) => setModalDeckColor2(e.target.value)}
                              className="size-6 rounded cursor-pointer bg-transparent border-none"
                            />
                          </div>
                        </div>
                        <div 
                          className="size-16 rounded-xl border-2 border-white shadow-sm"
                          style={{ background: `linear-gradient(to bottom right, ${modalDeckColor1}, ${modalDeckColor2})` }}
                        ></div>
                      </div>
                    ) : (
                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {deckGradients.map(grad => (
                          <button
                            key={grad.id}
                            onClick={() => setModalDeckGradient(grad.id)}
                            className={`size-8 rounded-full border-2 flex-shrink-0 ${grad.class} ${modalDeckGradient === grad.id ? 'border-white ring-2 ring-primary/50' : 'border-transparent'}`}
                            title={grad.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={modalType === "createDeck" ? confirmCreateDeck : confirmEditDeck}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-primary text-white"
                    >
                      {modalType === "createDeck" ? "Create Deck" : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}

              {modalType === "deleteDeck" && (
                <div className="space-y-4">
                  <p className="text-center text-slate-700 dark:text-slate-400">
                    Are you sure you want to delete this deck? All cards inside will be permanently lost.
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmDeleteDeck}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-red-500 text-white"
                    >
                      Delete Deck
                    </button>
                  </div>
                </div>
              )}

              {modalType === "deleteCard" && (
                <div className="space-y-4">
                  <p className="text-center text-slate-700 dark:text-slate-400">
                    Are you sure you want to delete this card?
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmDeleteCard}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-red-500 text-white"
                    >
                      Delete Card
                    </button>
                  </div>
                </div>
              )}

              {modalType === "aiGenerate" && (
                <div className="space-y-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      Generate with MKR Ai
                    </p>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-400 mb-4">
                    Tell MKR Ai what kind of cards you want to generate.
                    {!selectedDeck && " A new deck will be created for these cards."}
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Number of Cards</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[5, 10, 15, 50].map((num) => (
                        <button
                          key={num}
                          onClick={() => setNumCardsToGenerate(num)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            numCardsToGenerate === num
                              ? "bg-purple-500 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => setNumCardsToGenerate("custom")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          numCardsToGenerate === "custom"
                            ? "bg-purple-500 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                    {numCardsToGenerate === "custom" && (
                      <div className="mb-4">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={customNumCards}
                          onChange={(e) => setCustomNumCards(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none"
                          placeholder="Enter number (max 100)"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Topic / Instructions</label>
                    <textarea 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Newton's laws of motion, or French vocabulary for travel"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none min-h-[80px] resize-none"
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setModalType("none")}
                      disabled={isGenerating}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleGenerateAI}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                      {isGenerating ? "Generating..." : "Generate"}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-3 italic">
                    Note: MKR Ai can occasionally make mistakes. Please verify the generated content.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Flashcards;
