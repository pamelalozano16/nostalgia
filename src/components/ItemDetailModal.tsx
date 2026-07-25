import React, { useState } from 'react';
import { X, Check, Sparkles, Heart, ShieldCheck } from 'lucide-react';
import { CatalogItem, PartySetup } from '../types';

interface ItemDetailModalProps {
  item: CatalogItem | null;
  onClose: () => void;
  partySetup: PartySetup;
  onAddToPackage: (
    item: CatalogItem,
    brideQty: number,
    bridesmaidQty: number,
    flatQty: number,
    notes?: string
  ) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  partySetup,
  onAddToPackage,
}) => {
  if (!item) return null;

  const [brideQty, setBrideQty] = useState<number>(
    item.supportsSplit ? partySetup.brideCount : 0
  );
  const [bridesmaidQty, setBridesmaidQty] = useState<number>(
    item.supportsSplit ? partySetup.bridesmaidCount : 0
  );
  const [flatQty, setFlatQty] = useState<number>(
    item.supportsSplit ? 0 : 1
  );

  const [selectedColor, setSelectedColor] = useState<string>(
    item.colorOptions ? item.colorOptions[0] : ''
  );
  const [customNotes, setCustomNotes] = useState<string>('');
  const [added, setAdded] = useState(false);

  const itemSubtotal = item.supportsSplit
    ? brideQty * item.bridePrice + bridesmaidQty * item.bridesmaidPrice
    : flatQty * item.bridePrice;

  const handleAdd = () => {
    onAddToPackage(item, brideQty, bridesmaidQty, flatQty, customNotes);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFDFB] rounded-sm max-w-2xl w-full nostalgic-border shadow-2xl overflow-hidden relative animate-in fade-in duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#EFE8E1] hover:bg-[#E4D9CE] text-[#3A3530] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Side */}
          <div className="bg-[#F4EAE6] p-6 flex flex-col justify-between relative min-h-[300px]">
            {item.badge && (
              <span className="absolute top-4 left-4 z-10 text-[9px] uppercase tracking-widest font-bold bg-[#FFFDFB] text-[#8C786A] px-3 py-1 rounded-xs border border-[#8C786A]/30">
                {item.badge}
              </span>
            )}
            <img
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xs shadow-sm max-h-[360px] my-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/' + item.id + '/800/800';
              }}
            />
            <div className="mt-4 pt-3 border-t border-[#8C786A]/20 flex items-center justify-between text-[11px] text-[#8C786A]">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-[#8C786A]/20" /> Diseño Artesanal
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Muestra Digital Gratis
              </span>
            </div>
          </div>

          {/* Details & Configurator Side */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C786A] font-semibold">
                Detalle Nostalgia
              </span>
              <h2 className="serif text-2xl font-bold text-[#3A3530]">
                {item.title}
              </h2>
              {item.subtitle && (
                <p className="text-xs text-[#8C786A] italic font-serif">
                  {item.subtitle}
                </p>
              )}
              <p className="text-xs text-[#3A3530]/80 leading-relaxed pt-1">
                {item.description}
              </p>
            </div>

            {/* Colors option selector if available */}
            {item.colorOptions && item.colorOptions.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-[#8C786A] tracking-wider block">
                  Seleccionar Paleta / Estilo: <span className="font-normal text-[#3A3530]">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {item.colorOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-2.5 py-1 text-[11px] rounded-xs border transition-colors cursor-pointer ${
                        selectedColor === c
                          ? 'border-[#8C786A] bg-[#8C786A] text-white font-semibold'
                          : 'border-[#8C786A]/30 bg-[#F9F7F2] text-[#3A3530] hover:bg-[#EFE8E1]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantities Form */}
            <div className="p-4 bg-[#F9F7F2] rounded-xs border border-[#8C786A]/20 space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#8C786A] tracking-wider block">
                Cálculo de Cantidades
              </span>

              {item.supportsSplit ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#3A3530] font-medium block mb-1">
                      Unidades Novia (${item.bridePrice}/c.u.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={brideQty}
                      onChange={(e) => setBrideQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 bg-white border border-[#8C786A]/30 text-xs font-mono font-bold text-[#3A3530] rounded-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#3A3530] font-medium block mb-1">
                      Unidades Damas (${item.bridesmaidPrice}/c.u.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={bridesmaidQty}
                      onChange={(e) => setBridesmaidQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 bg-white border border-[#8C786A]/30 text-xs font-mono font-bold text-[#3A3530] rounded-xs focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] text-[#3A3530] font-medium block mb-1">
                    Número de Paquetes ({item.unitLabel})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={flatQty}
                    onChange={(e) => setFlatQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2 bg-white border border-[#8C786A]/30 text-xs font-mono font-bold text-[#3A3530] rounded-xs focus:outline-none"
                  />
                </div>
              )}

              {/* Customization Note input */}
              <div>
                <label className="text-[10px] text-[#8C786A] font-bold uppercase tracking-wider block mb-1">
                  Notas de Personalización
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder={item.customizationNotesPlaceholder || "ej. Nombres, fechas, apodos o chistes locales"}
                  className="w-full p-2 bg-white border border-[#8C786A]/30 text-xs text-[#3A3530] rounded-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Total and Action */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C786A] block">
                  Subtotal
                </span>
                <span className="text-xl font-mono font-bold text-[#3A3530]">
                  ${itemSubtotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-4 btn-primary rounded-xs text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  added ? 'bg-[#5B7563] text-white' : ''
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> ¡Agregado al Paquete!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Agregar al Paquete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
