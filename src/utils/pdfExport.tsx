import html2pdf from "html2pdf.js";
import { Deck, Card } from "../context/AppContext";

const themeColors: Record<string, string> = {
  "default": "#ffffff",
  "blue": "#eff6ff",
  "green": "#ecfdf5",
  "yellow": "#fffbeb",
  "purple": "#faf5ff",
  "rose": "#fff1f2",
};

export const exportDecksToPDF = async (decks: Deck[], title: string = "Revision Master - All Decks") => {
  // Preload all images to ensure they render in the PDF
  const imageUrls: string[] = [];
  decks.forEach(deck => {
    deck.cards.forEach(card => {
      if (card.image) imageUrls.push(card.image);
    });
  });

  await Promise.all(imageUrls.map(url => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = url;
    });
  }));

  // Create container for PDF content
  const container = document.createElement("div");
  container.style.width = "800px"; // Fixed width for A4 proportion
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#000000";
  container.style.fontFamily = "sans-serif";
  container.style.padding = "40px";
  
  let htmlContent = `
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 32px; color: #333; margin: 0;">${title}</h1>
      <p style="color: #666; margin-top: 10px;">Generated on ${new Date().toLocaleDateString()}</p>
    </div>
  `;

  decks.forEach((deck) => {
    if (deck.cards.length === 0) return;
    
    htmlContent += `
      <div style="margin-bottom: 40px; page-break-inside: avoid;">
        <h2 style="font-size: 24px; color: #222; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
          ${deck.name} <span style="font-size: 14px; color: #888; font-weight: normal;">(${deck.type})</span>
        </h2>
    `;

    deck.cards.forEach((card, index) => {
      const bgColor = themeColors[card.theme || "default"] || "#ffffff";
      htmlContent += `
        <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background-color: ${bgColor}; page-break-inside: avoid;">
          <div style="margin-bottom: 10px;">
            <strong style="color: #444; font-size: 16px;">Q${index + 1}:</strong> 
            <span style="font-size: 16px; color: #111;">${card.front}</span>
          </div>
          ${card.image && card.showImageOnFront ? `<div style="margin: 10px 0; text-align: center;"><img src="${card.image}" style="max-width: 100%; max-height: 200px; border-radius: 4px;" /></div>` : ''}
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc;">
            <strong style="color: #444; font-size: 16px;">A:</strong> 
            <span style="font-size: 16px; color: #333;">${card.back}</span>
          </div>
          ${card.image && !card.showImageOnFront ? `<div style="margin: 10px 0; text-align: center;"><img src="${card.image}" style="max-width: 100%; max-height: 200px; border-radius: 4px;" /></div>` : ''}
          ${card.notes ? `<div style="margin-top: 10px; font-size: 14px; color: #666; font-style: italic;"><strong>Notes:</strong> ${card.notes}</div>` : ''}
        </div>
      `;
    });

    htmlContent += `</div>`;
  });

  container.innerHTML = htmlContent;

  try {
    const opt = {
      margin:       10,
      filename:     title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf',
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false, windowWidth: 800 },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    await html2pdf().set(opt).from(container).save();

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};
