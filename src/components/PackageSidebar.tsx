import React, { useState } from 'react';
import { ShoppingBag, Trash2, Edit3, ArrowRight, Sparkles, MapPin, Calendar, Heart, FileText, CheckCircle2 } from 'lucide-react';
import { CartPackageItem, PartySetup } from '../types';

interface PackageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartPackageItem[];
  partySetup: PartySetup;
  onUpdatePartySetup: (updated: Partial<PartySetup>) => void;
  onUpdateCartItemQty: (id: string, brideQty: number, bridesmaidQty: number, flatQty: number) => void;
  onRemoveCartItem: (id: string) => void;
  onOpenPartyModal: () => void;
  onOpenSummaryModal: () => void;
}

export const PackageSidebar: React.FC<PackageSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  partySetup,
  onUpdatePartySetup,
  onUpdateCartItemQty,
  onRemoveCartItem,
  onOpenPartyModal,
  onOpenSummaryModal,
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'customization'>('items');

  // Calculate items subtotal
  const itemsSubtotal = cartItems.reduce((sum, ci) => {
    if (ci.item.supportsSplit) {
      return sum + (ci.brideQty * ci.item.bridePrice) + (ci.bridesmaidQty * ci.item.bridesmaidPrice);
    }
    return sum + (ci.flatQty * ci.item.bridePrice);
  }, 0);

  const estimatedShipping = itemsSubtotal > 0 ? 15.00 : 0;
  const grandTotal = itemsSubtotal + estimatedShipping;

  return (
    <aside 
      className={`fixed top-0 right-0 h-full w-full sm:w-[450px] lg:w-[480px] package-sidebar shadow-2xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b nostalgic-border bg-[#FFFDFB] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8C786A] block">
            Nostalgia Despedidas
          </span>
          <h2 className="serif text-2xl font-semibold text-[#3A3530]">
            Tu Caja de Evento
          </h2>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#EFE8E1] hover:bg-[#E4D9CE] text-[#4A3E3D] flex items-center justify-center transition-colors cursor-pointer text-sm font-semibold"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b nostalgic-border bg-[#F9F7F2]">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'items'
              ? 'border-[#8C786A] text-[#8C786A] bg-[#FFFDFB]'
              : 'border-transparent text-[#3A3530]/60 hover:text-[#3A3530]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Artículos ({cartItems.length})
        </button>

        <button
          onClick={() => setActiveTab('customization')}
          className={`flex-1 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'customization'
              ? 'border-[#8C786A] text-[#8C786A] bg-[#FFFDFB]'
              : 'border-transparent text-[#3A3530]/60 hover:text-[#3A3530]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Datos Novia
        </button>
      </div>

      {/* Quick Party Size Banner */}
      <div className="bg-[#F8ECE8] px-6 py-2.5 border-b nostalgic-border flex items-center justify-between text-xs text-[#4A3E3D]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#8C786A]" />
          <span>
            Equipo: <strong>{partySetup.brideCount} Novia</strong> + <strong>{partySetup.bridesmaidCount} Damas</strong>
          </span>
        </div>
        <button
          onClick={onOpenPartyModal}
          className="text-[10px] uppercase font-bold text-[#8C786A] hover:underline cursor-pointer flex items-center gap-1"
        >
          <Edit3 className="w-3 h-3" /> Editar
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'items' ? (
          cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F8ECE8] text-[#8C786A] flex items-center justify-center mx-auto nostalgic-border">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="serif text-xl text-[#3A3530] italic">
                Tu paquete aún está vacío
              </h3>
              <p className="text-xs text-[#8C786A] max-w-xs mx-auto leading-relaxed">
                Navega en la colección y selecciona tops personalizados, termos mate, máscaras del novio y detalles retro para la gran despedida.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((ci) => {
                const itemSubtotal = ci.item.supportsSplit
                  ? ci.brideQty * ci.item.bridePrice + ci.bridesmaidQty * ci.item.bridesmaidPrice
                  : ci.flatQty * ci.item.bridePrice;

                return (
                  <div
                    key={ci.id}
                    className="p-4 bg-white rounded-xs border border-[#8C786A]/20 space-y-3 relative group transition-all hover:border-[#8C786A]/50"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <img
                        src={ci.item.imageUrl}
                        alt={ci.item.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-xs border border-[#8C786A]/20"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-[#3A3530] uppercase tracking-wider truncate">
                          {ci.item.title}
                        </h4>
                        <p className="text-[11px] text-[#8C786A] italic font-serif">
                          {ci.item.subtitle || ci.item.unitLabel}
                        </p>
                      </div>

                      <div className="text-right font-mono font-bold text-xs text-[#3A3530]">
                        ${itemSubtotal.toFixed(2)}
                      </div>
                    </div>

                    {/* Breakdown & Controls */}
                    <div className="pt-2 border-t border-dashed border-[#8C786A]/20 flex items-center justify-between text-xs">
                      {ci.item.supportsSplit ? (
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="bg-[#F8ECE8] text-[#4A3E3D] px-2 py-0.5 rounded-xs font-mono font-semibold">
                            {ci.brideQty} Novia
                          </span>
                          <span className="bg-[#E5EBE6] text-[#2D4233] px-2 py-0.5 rounded-xs font-mono font-semibold">
                            {ci.bridesmaidQty} Damas
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-[#8C786A]">
                          Cant: {ci.flatQty} {ci.item.unitLabel}
                        </span>
                      )}

                      <button
                        onClick={() => onRemoveCartItem(ci.id)}
                        className="text-[#8C786A] hover:text-red-700 text-xs flex items-center gap-1 cursor-pointer"
                        title="Eliminar artículo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Customization Tab */
          <div className="space-y-4 text-xs">
            <div className="bg-[#F9F7F2] p-4 rounded-xs border border-[#8C786A]/20 space-y-3">
              <h4 className="serif font-semibold text-sm text-[#3A3530] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#8C786A]" /> Información de la Novia y Novio
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
                    Nombre de la Novia *
                  </label>
                  <input
                    type="text"
                    value={partySetup.brideName}
                    onChange={(e) => onUpdatePartySetup({ brideName: e.target.value })}
                    placeholder="ej. Sofia"
                    className="w-full p-2 bg-white border border-[#8C786A]/30 rounded-xs text-xs focus:outline-none focus:border-[#8C786A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
                    Nombre del Novio
                  </label>
                  <input
                    type="text"
                    value={partySetup.groomName}
                    onChange={(e) => onUpdatePartySetup({ groomName: e.target.value })}
                    placeholder="ej. Mateo"
                    className="w-full p-2 bg-white border border-[#8C786A]/30 rounded-xs text-xs focus:outline-none focus:border-[#8C786A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Destino
                  </label>
                  <input
                    type="text"
                    value={partySetup.destination}
                    onChange={(e) => onUpdatePartySetup({ destination: e.target.value })}
                    placeholder="ej. Tulum, Valle de Guadalupe"
                    className="w-full p-2 bg-white border border-[#8C786A]/30 rounded-xs text-xs focus:outline-none focus:border-[#8C786A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Fecha del Evento
                  </label>
                  <input
                    type="text"
                    value={partySetup.eventDate}
                    onChange={(e) => onUpdatePartySetup({ eventDate: e.target.value })}
                    placeholder="ej. 18-21 Septiembre 2026"
                    className="w-full p-2 bg-white border border-[#8C786A]/30 rounded-xs text-xs focus:outline-none focus:border-[#8C786A]"
                  />
                </div>
              </div>
            </div>

            {/* Inside Jokes & Notes */}
            <div className="bg-[#F9F7F2] p-4 rounded-xs border border-[#8C786A]/20 space-y-2">
              <label className="text-[10px] uppercase font-bold text-[#8C786A] block">
                Chistes Locales, Frases y Detalles Especiales
              </label>
              <textarea
                rows={3}
                value={partySetup.insideJokesNotes}
                onChange={(e) => onUpdatePartySetup({ insideJokesNotes: e.target.value })}
                placeholder="Escribe frases divertidas, apodos, o ideas para los stickers, tops o máscaras del novio..."
                className="w-full p-2 bg-white border border-[#8C786A]/30 rounded-xs text-xs focus:outline-none focus:border-[#8C786A]"
              />
              <p className="text-[10px] text-[#8C786A] italic">
                ¡Nuestro equipo incluirá estos detalles en las muestras digitales de tu pedido!
              </p>
            </div>

            {/* Contact Details */}
            <div className="bg-[#F9F7F2] p-4 rounded-xs border border-[#8C786A]/20 space-y-3">
              <h4 className="serif font-semibold text-sm text-[#3A3530]">
                Datos de Contacto para Cotización
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={partySetup.contactEmail}
                    onChange={(e) => onUpdatePartySetup({ contactEmail: e.target.value })}
                    placeholder="tuemail@gmail.com"
                    className="w-full p-2 bg-white border border-[#8C786A]/30 rounded-xs text-xs focus:outline-none focus:border-[#8C786A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
                    WhatsApp / Teléfono
                  </label>
                  <input
                    type="tel"
                    value={partySetup.contactPhone}
                    onChange={(e) => onUpdatePartySetup({ contactPhone: e.target.value })}
                    placeholder="+52 81..."
                    className="w-full p-2 bg-white border border-[#8C786A]/30 rounded-xs text-xs focus:outline-none focus:border-[#8C786A]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Total Investment & Action */}
      <div className="p-6 border-t nostalgic-border bg-[#FFFDFB] mt-auto space-y-4">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-[#3A3530]">
            <span className="uppercase tracking-widest text-[11px]">Subtotal de Productos</span>
            <span className="font-mono font-bold">${itemsSubtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-[11px] text-[#8C786A]">
            <span className="uppercase tracking-widest">Diseño Digital y Ajustes</span>
            <span className="font-mono text-[#5B7563] font-semibold">GRATIS Promo</span>
          </div>

          <div className="flex justify-between text-[11px] text-[#8C786A]">
            <span className="uppercase tracking-widest">Envío Estimado</span>
            <span className="font-mono">${estimatedShipping.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg serif pt-2 border-t border-dashed border-[#8C786A]/30 text-[#3A3530]">
            <span>Inversión Total</span>
            <span className="font-bold font-mono">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onOpenSummaryModal}
          disabled={cartItems.length === 0}
          className="w-full py-3.5 btn-primary text-xs uppercase tracking-[0.2em] font-bold rounded-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <span>Finalizar y Solicitar Cotización</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-center italic text-[#8C786A]">
          "Porque cada recuerdo merece un lugar físico en el corazón."
        </p>
      </div>
    </aside>
  );
};
