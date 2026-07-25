import React, { useState } from 'react';
import { Plus, Check, Info, Sparkles } from 'lucide-react';
import { CatalogItem, PartySetup } from '../types';

interface ItemCardProps {
  item: CatalogItem;
  partySetup: PartySetup;
  inCartQty?: { brideQty: number; bridesmaidQty: number; flatQty: number };
  onAddToPackage: (
    item: CatalogItem,
    brideQty: number,
    bridesmaidQty: number,
    flatQty: number,
    notes?: string
  ) => void;
  onOpenDetail: (item: CatalogItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  partySetup,
  inCartQty,
  onAddToPackage,
  onOpenDetail,
}) => {
  // Initialize quantities with party default or existing cart quantities
  const [brideQty, setBrideQty] = useState<number>(
    inCartQty ? inCartQty.brideQty : (item.supportsSplit ? partySetup.brideCount : 0)
  );
  const [bridesmaidQty, setBridesmaidQty] = useState<number>(
    inCartQty ? inCartQty.bridesmaidQty : (item.supportsSplit ? partySetup.bridesmaidCount : 0)
  );
  const [flatQty, setFlatQty] = useState<number>(
    inCartQty ? inCartQty.flatQty : (item.supportsSplit ? 0 : 1)
  );

  const [addedAnimation, setAddedAnimation] = useState(false);

  // Calculate dynamic subtotal for this item card
  const calculatedSubtotal = item.supportsSplit
    ? brideQty * item.bridePrice + bridesmaidQty * item.bridesmaidPrice
    : flatQty * item.bridePrice;

  const handleAdd = () => {
    onAddToPackage(item, brideQty, bridesmaidQty, flatQty);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const isAlreadyInCart = inCartQty && (inCartQty.brideQty > 0 || inCartQty.bridesmaidQty > 0 || inCartQty.flatQty > 0);

  return (
    <div className="item-card p-5 rounded-sm flex flex-col gap-4 bg-white relative group shadow-xs">
      {/* Badge if available */}
      {item.badge && (
        <span className="absolute top-3 right-3 z-10 text-[9px] uppercase tracking-widest font-bold bg-[#F4EAE6] text-[#6F5E53] px-2.5 py-1 rounded-xs shadow-xs">
          {item.badge}
        </span>
      )}

      {/* Image thumbnail container */}
      <div 
        onClick={() => onOpenDetail(item)}
        className="aspect-[4/3] bg-[#F4EAE6] rounded-xs overflow-hidden relative cursor-pointer group-hover:opacity-95 transition-all"
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/' + item.id + '/800/600';
          }}
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-[#FFFDFB]/90 text-[#3A3530] text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 rounded-xs flex items-center gap-1.5 shadow-sm">
            <Info className="w-3 h-3 text-[#8C786A]" /> Ver Detalles
          </span>
        </div>
      </div>

      {/* Item info header */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1 gap-2">
            <div>
              <h3 
                onClick={() => onOpenDetail(item)}
                className="font-semibold text-base text-[#3A3530] cursor-pointer hover:text-[#8C786A] transition-colors leading-tight"
              >
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="text-[11px] text-[#8C786A] italic font-serif mt-0.5">
                  {item.subtitle}
                </p>
              )}
            </div>
            
            {/* Price tag */}
            <div className="text-right whitespace-nowrap">
              {item.supportsSplit ? (
                <div className="flex flex-col items-end">
                  <span className="text-xs font-mono font-bold text-[#3A3530]">
                    ${item.bridesmaidPrice.toFixed(2)}
                    <span className="text-[9px] font-sans font-normal text-[#8C786A]">/c.u.</span>
                  </span>
                  <span className="text-[9px] text-[#8C786A]">
                    Novia: ${item.bridePrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-mono font-bold text-[#3A3530]">
                  ${item.bridePrice.toFixed(2)}
                  <span className="text-[10px] font-sans font-normal text-[#8C786A]"> {item.unitLabel}</span>
                </span>
              )}
            </div>
          </div>

          <p className="text-[12px] opacity-70 leading-relaxed mb-4 text-[#3A3530] line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Quantity Controls - Bride & Bridesmaids split */}
        <div className="pt-3 border-t border-dashed border-[#8C786A]/20 space-y-3">
          {item.supportsSplit ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] uppercase font-bold text-[#8C786A] mb-1 block tracking-wider">
                  Cant. Novia
                </label>
                <div className="flex items-center bg-[#F9F7F2] rounded-xs px-2 py-0.5">
                  <input
                    type="number"
                    min="0"
                    value={brideQty}
                    onChange={(e) => setBrideQty(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-xs font-mono py-1 focus:outline-none bg-transparent text-[#3A3530] font-semibold"
                  />
                  <span className="text-[10px] text-[#8C786A] shrink-0">(${item.bridePrice})</span>
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold text-[#8C786A] mb-1 block tracking-wider">
                  Cant. Damas
                </label>
                <div className="flex items-center bg-[#F9F7F2] rounded-xs px-2 py-0.5">
                  <input
                    type="number"
                    min="0"
                    value={bridesmaidQty}
                    onChange={(e) => setBridesmaidQty(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-xs font-mono py-1 focus:outline-none bg-transparent text-[#3A3530] font-semibold"
                  />
                  <span className="text-[10px] text-[#8C786A] shrink-0">(${item.bridesmaidPrice})</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[9px] uppercase font-bold text-[#8C786A] mb-1 block tracking-wider">
                Cantidad ({item.unitLabel})
              </label>
              <div className="flex items-center bg-[#F9F7F2] rounded-xs px-1 py-0.5">
                <button
                  type="button"
                  onClick={() => setFlatQty(Math.max(1, flatQty - 1))}
                  className="px-2 py-1 text-xs text-[#8C786A] hover:bg-[#EFE8E1] rounded-xs"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={flatQty}
                  onChange={(e) => setFlatQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xs font-mono py-1 text-center focus:outline-none bg-transparent text-[#3A3530] font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setFlatQty(flatQty + 1)}
                  className="px-2 py-1 text-xs text-[#8C786A] hover:bg-[#EFE8E1] rounded-xs"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Subtotal calculation & Add Button */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-[#8C786A]">
                Subtotal Artículo
              </span>
              <span className="text-sm font-mono font-bold text-[#3A3530]">
                ${calculatedSubtotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleAdd}
              className={`h-9 px-4 rounded-xs text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                addedAnimation
                  ? 'bg-[#5B7563] text-white scale-102'
                  : isAlreadyInCart
                  ? 'bg-[#EFE8E1] text-[#4A3E3D] hover:bg-[#8C786A] hover:text-white'
                  : 'btn-primary'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" /> ¡Agregado!
                </>
              ) : isAlreadyInCart ? (
                <>
                  <Sparkles className="w-3 h-3 text-[#8C786A]" /> Actualizar Paquete
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Agregar al Paquete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
