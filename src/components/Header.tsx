import React from 'react';
import { ShoppingBag, Users, Sparkles, Settings, Heart } from 'lucide-react';
import { PartySetup } from '../types';
import brandLogoImg from '../assets/images/nostalgia_brand_logo_1784934829302.jpg';

interface HeaderProps {
  partySetup: PartySetup;
  onOpenPartyModal: () => void;
  onOpenCartDrawer: () => void;
  onOpenStoryModal: () => void;
  onOpenAdminModal: () => void;
  cartItemCount: number;
  totalPrice: number;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  partySetup,
  onOpenPartyModal,
  onOpenCartDrawer,
  onOpenStoryModal,
  onOpenAdminModal,
  cartItemCount,
  totalPrice,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F9F7F2]/95 backdrop-blur-md border-b nostalgic-border transition-all shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-[#8C786A] text-[#FFFDFB] text-[11px] py-1.5 px-4 text-center tracking-widest font-light flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-[#E2C3AA]" />
        <span>Paquetes de despedida de soltera hechos a la medida. ¡Diseños digitales y muestras gratis sin compromiso!</span>
        <Sparkles className="w-3 h-3 text-[#E2C3AA]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Using the user provided Nostalgia logo image */}
        <div 
          onClick={onOpenStoryModal}
          className="flex items-center gap-3 cursor-pointer group select-none py-1"
          title="Haz clic para conocer la historia de Nostalgia"
        >
          <div className="relative overflow-hidden rounded-sm border border-[#8C786A]/30 shadow-xs group-hover:border-[#8C786A] transition-all bg-[#EFE8E1]">
            <img 
              src={brandLogoImg} 
              alt="Logo Nostalgia" 
              className="h-12 w-auto sm:h-14 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="hidden xs:flex flex-col">
            <span className="script-font text-2xl text-[#4A3E3D] -mb-2 group-hover:text-[#8C786A] transition-colors">
              Nostalgia
            </span>
            <span className="serif text-xs tracking-[0.3em] uppercase text-[#3A3530] font-bold">
              Despedidas
            </span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#8C786A] font-medium">
              Memorias Inolvidables
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-medium text-[#3A3530]">
          <a href="#catalogue" className="hover:text-[#8C786A] transition-colors py-1">
            Catálogo
          </a>
          <button 
            onClick={onOpenStoryModal}
            className="hover:text-[#8C786A] transition-colors py-1 flex items-center gap-1.5 cursor-pointer"
          >
            <Heart className="w-3 h-3 text-[#8C786A]" />
            Nuestra Historia
          </button>
          
          {/* Party Size Quick Button */}
          <button
            onClick={onOpenPartyModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFE8E1] hover:bg-[#E4D9CE] nostalgic-border text-[#4A3E3D] transition-colors cursor-pointer text-[11px]"
          >
            <Users className="w-3.5 h-3.5 text-[#8C786A]" />
            <span className="font-semibold">{partySetup.brideCount} Novia</span>
            <span className="opacity-40">•</span>
            <span>{partySetup.bridesmaidCount} Damas</span>
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Mobile Party Quick trigger */}
          <button
            onClick={onOpenPartyModal}
            className="md:hidden p-2 rounded-md bg-[#EFE8E1] text-[#4A3E3D] nostalgic-border text-xs flex items-center gap-1"
            title="Ajustar número de personas"
          >
            <Users className="w-4 h-4 text-[#8C786A]" />
            <span className="text-[10px] font-bold">{partySetup.brideCount + partySetup.bridesmaidCount}</span>
          </button>

          {/* Owner Admin Settings */}
          <button
            onClick={onOpenAdminModal}
            className="p-2 text-[#786558] hover:text-[#3A3530] hover:bg-[#EFE8E1] rounded-full transition-colors cursor-pointer"
            title="Configuración y Administrador de Precios"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Add to Package / Cart Drawer Trigger */}
          <button
            onClick={onOpenCartDrawer}
            className="btn-primary px-4 py-2.5 rounded-sm flex items-center gap-2.5 cursor-pointer shadow-xs text-xs uppercase tracking-wider font-semibold relative"
          >
            <ShoppingBag className="w-4 h-4 text-[#F4EAE6]" />
            <span className="hidden sm:inline">Tu Paquete</span>
            {cartItemCount > 0 && (
              <span className="bg-[#F8ECE8] text-[#4A3E3D] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center -ml-0.5">
                {cartItemCount}
              </span>
            )}
            <span className="font-mono ml-1 text-[11px] opacity-90 border-l border-white/20 pl-2">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
