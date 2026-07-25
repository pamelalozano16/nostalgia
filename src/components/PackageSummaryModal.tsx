import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Send, Sparkles, Heart, FileText, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartPackageItem, PartySetup, OwnerConfig } from '../types';

interface PackageSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartPackageItem[];
  partySetup: PartySetup;
  ownerConfig: OwnerConfig;
}

export const PackageSummaryModal: React.FC<PackageSummaryModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  partySetup,
  ownerConfig,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  // Trigger confetti on open
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8C786A', '#F4EAE6', '#E2E8E4', '#DDB892', '#C68B59'],
    });
  }, []);

  const itemsSubtotal = cartItems.reduce((sum, ci) => {
    if (ci.item.supportsSplit) {
      return sum + ci.brideQty * ci.item.bridePrice + ci.bridesmaidQty * ci.item.bridesmaidPrice;
    }
    return sum + ci.flatQty * ci.item.bridePrice;
  }, 0);

  const estimatedShipping = itemsSubtotal > 0 ? 15.0 : 0;
  const grandTotal = itemsSubtotal + estimatedShipping;

  // Format order text for copying / WhatsApp
  const generateFormattedSummaryText = () => {
    const lines = [
      `✨ *SOLICITUD DE COTIZACIÓN - NOSTALGIA DESPEDIDAS* ✨`,
      `----------------------------------------`,
      `👰 *Novia:* ${partySetup.brideName || 'Novia'}`,
      `🤵 *Novio:* ${partySetup.groomName || 'N/A'}`,
      `📍 *Destino:* ${partySetup.destination || 'Por definir'}`,
      `📅 *Fecha:* ${partySetup.eventDate || 'Por definir'}`,
      `👥 *Equipo:* ${partySetup.brideCount} Novia + ${partySetup.bridesmaidCount} Damas`,
      ``,
      `📦 *ARTÍCULOS DEL PAQUETE:*`,
    ];

    cartItems.forEach((ci, idx) => {
      if (ci.item.supportsSplit) {
        const itemTotal = ci.brideQty * ci.item.bridePrice + ci.bridesmaidQty * ci.item.bridesmaidPrice;
        lines.push(
          `${idx + 1}. *${ci.item.title}*: ${ci.brideQty} Novia, ${ci.bridesmaidQty} Damas → $${itemTotal.toFixed(2)}`
        );
      } else {
        const itemTotal = ci.flatQty * ci.item.bridePrice;
        lines.push(`${idx + 1}. *${ci.item.title}*: ${ci.flatQty} ${ci.item.unitLabel} → $${itemTotal.toFixed(2)}`);
      }
    });

    lines.push(
      ``,
      `----------------------------------------`,
      `💰 *Subtotal:* $${itemsSubtotal.toFixed(2)}`,
      `📦 *Envío Estimado:* $${estimatedShipping.toFixed(2)}`,
      `🎉 *INVERSIÓN TOTAL ESTIMADA:* $${grandTotal.toFixed(2)}`,
      ``
    );

    if (partySetup.insideJokesNotes) {
      lines.push(`💭 *Chistes Locales y Notas:* "${partySetup.insideJokesNotes}"`);
    }

    lines.push(
      ``,
      `Enviado desde la app Nostalgia • Creando Recuerdos Inolvidables`
    );

    return lines.join('\n');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateFormattedSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(generateFormattedSummaryText());
    const cleanPhone = ownerConfig.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFDFB] rounded-sm max-w-2xl w-full nostalgic-border shadow-2xl p-6 sm:p-8 space-y-6 relative my-8 animate-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EFE8E1] hover:bg-[#E4D9CE] text-[#3A3530] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Vintage Header */}
        <div className="text-center space-y-2 border-b border-dashed border-[#8C786A]/30 pb-6">
          <div className="flex items-center justify-center gap-1.5 text-[#8C786A] text-xs uppercase tracking-[0.2em] font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Nostalgia Cotización
          </div>
          <h2 className="serif text-3xl sm:text-4xl text-[#3A3530] font-semibold">
            Resumen de tu Paquete
          </h2>
          <p className="script-font text-2xl text-[#8C786A] -mt-1">
            Para la celebración inolvidable de {partySetup.brideName || 'la Novia'}
          </p>
        </div>

        {/* Polaroid Card Display */}
        <div className="bg-[#F9F7F2] p-6 rounded-xs border border-[#8C786A]/30 space-y-4 shadow-inner">
          <div className="grid grid-cols-2 gap-4 text-xs pb-4 border-b border-[#8C786A]/20">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C786A] block">Novia y Novio</span>
              <p className="font-semibold text-sm text-[#3A3530]">
                {partySetup.brideName || 'Novia'} {partySetup.groomName ? `y ${partySetup.groomName}` : ''}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C786A] block">Destino y Fecha</span>
              <p className="font-semibold text-sm text-[#3A3530]">
                {partySetup.destination || 'Por definir'} • {partySetup.eventDate || '2026'}
              </p>
            </div>
          </div>

          {/* Selected Items Breakdown */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            <span className="text-[10px] uppercase font-bold text-[#8C786A] tracking-wider block">
              Desglose de Productos ({cartItems.length} artículos)
            </span>

            {cartItems.map((ci) => {
              const sub = ci.item.supportsSplit
                ? ci.brideQty * ci.item.bridePrice + ci.bridesmaidQty * ci.item.bridesmaidPrice
                : ci.flatQty * ci.item.bridePrice;

              return (
                <div key={ci.id} className="flex justify-between items-center text-xs py-1.5 border-b border-dashed border-[#8C786A]/20">
                  <div>
                    <span className="font-semibold text-[#3A3530] uppercase tracking-tight block">
                      {ci.item.title}
                    </span>
                    <span className="text-[10px] text-[#8C786A] font-mono">
                      {ci.item.supportsSplit
                        ? `${ci.brideQty} Novia / ${ci.bridesmaidQty} Damas`
                        : `${ci.flatQty} ${ci.item.unitLabel}`}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#3A3530]">${sub.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          {/* Memory Notes if present */}
          {partySetup.insideJokesNotes && (
            <div className="bg-[#FFFDFB] p-3 rounded-xs border border-[#8C786A]/20 text-xs italic text-[#4A3E3D]">
              <span className="font-bold not-italic text-[10px] uppercase text-[#8C786A] block mb-0.5">
                Chistes Locales y Notas de Memoria:
              </span>
              "{partySetup.insideJokesNotes}"
            </div>
          )}

          {/* Financials Summary */}
          <div className="pt-3 border-t border-[#8C786A]/30 space-y-1.5 text-xs">
            <div className="flex justify-between text-[#8C786A]">
              <span>Subtotal Productos:</span>
              <span className="font-mono">${itemsSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#8C786A]">
              <span>Envío y Preparación Estimada:</span>
              <span className="font-mono">${estimatedShipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base serif font-bold text-[#3A3530] pt-2 border-t border-dashed border-[#8C786A]/30">
              <span>Inversión Total Estimada:</span>
              <span className="font-mono">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleWhatsAppSend}
              className="py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xs text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" /> Enviar Cotización por WhatsApp
            </button>

            <button
              onClick={handleCopyText}
              className="py-3 px-4 btn-secondary rounded-xs text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-700" /> ¡Copiado al Portapapeles!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8C786A]" /> Copiar Texto de Cotización
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-center text-[#8C786A] italic">
            ¿Dudas o preguntas? Contáctanos a {ownerConfig.contactEmail} o en Instagram {ownerConfig.instagramHandle}
          </p>
        </div>
      </div>
    </div>
  );
};
