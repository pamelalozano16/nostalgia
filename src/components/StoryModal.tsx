import React from 'react';
import { X, Heart, Sparkles, Image as ImageIcon, Camera } from 'lucide-react';
import heroBannerImg from '../assets/images/nostalgia_hero_banner_1784933629215.jpg';
import brideHatImg from '../assets/images/bride_cowboy_hat_1784933641871.jpg';
import tankTopImg from '../assets/images/custom_ribbed_tank_1784933656018.jpg';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFDFB] rounded-sm max-w-3xl w-full nostalgic-border shadow-2xl p-6 sm:p-10 space-y-8 relative my-8 animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EFE8E1] hover:bg-[#E4D9CE] text-[#3A3530] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Quote Card */}
        <div className="bg-[#F8ECE8] p-8 rounded-xs border border-[#8C786A]/30 text-center space-y-4 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C786A] font-bold block">
              Filosofía Nostalgia
            </span>
            <blockquote className="serif text-2xl sm:text-3xl text-[#3A3530] italic font-normal leading-snug max-w-xl mx-auto">
              "Qué privilegio sentir nostalgia por una vida llena de momentos que sí valieron la pena."
            </blockquote>
            <p className="text-xs text-[#8C786A] italic">
              — Celebrando el amor, la amistad y los momentos inolvidables de la novia.
            </p>
          </div>
        </div>

        {/* Story Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-xs text-[#3A3530]/80 leading-relaxed">
          <div className="space-y-4">
            <h3 className="serif text-2xl text-[#3A3530] font-semibold">
              Detalles Llenos de Amor para el Gran Día de la Novia
            </h3>
            <p>
              En <strong>Nostalgia</strong>, creemos que una despedida de soltera no debe ser solo una fiesta común, sino una experiencia profundamente personal, cálida e inolvidable.
            </p>
            <p>
              Desde tank tops personalizados con chistes locales, máscaras gigantes del novio para fotos divertidas junto a la alberca, hasta sombreros de vaquera con perlas bordadas a mano y mini botellas con foto, cada detalle es curado a mano para celebrar la historia de amor y la amistad sincera.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[#8C786A]">
              <Sparkles className="w-4 h-4" />
              <span className="serif italic text-sm font-semibold">
                Diseñado con amor y espíritu de nostalgia
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <img
                src={brideHatImg}
                alt="Sombrero de Novia con Perlas"
                referrerPolicy="no-referrer"
                className="w-full aspect-square object-cover rounded-xs border border-[#8C786A]/30 shadow-sm hover:scale-102 transition-transform"
              />
              <img
                src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800"
                alt="Celebración de Despedida"
                referrerPolicy="no-referrer"
                className="w-full aspect-video object-cover rounded-xs border border-[#8C786A]/30 shadow-sm hover:scale-102 transition-transform"
              />
            </div>
            <div className="space-y-3 pt-4">
              <img
                src={tankTopImg}
                alt="Tank Tops Personalizados"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/5] object-cover rounded-xs border border-[#8C786A]/30 shadow-sm hover:scale-102 transition-transform"
              />
            </div>
          </div>
        </div>

        {/* Closing CTA */}
        <div className="text-center pt-4 border-t border-dashed border-[#8C786A]/30">
          <button
            onClick={onClose}
            className="px-8 py-3 btn-primary text-xs uppercase tracking-widest font-bold rounded-xs cursor-pointer"
          >
            Explorar Colección de Despedidas
          </button>
        </div>
      </div>
    </div>
  );
};
