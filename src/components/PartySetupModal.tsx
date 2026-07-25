import React from 'react';
import { X, Users, Sparkles, Check } from 'lucide-react';
import { PartySetup } from '../types';

interface PartySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  partySetup: PartySetup;
  onSave: (updated: PartySetup) => void;
}

export const PartySetupModal: React.FC<PartySetupModalProps> = ({
  isOpen,
  onClose,
  partySetup,
  onSave,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = React.useState<PartySetup>({ ...partySetup });

  const applyPreset = (maids: number) => {
    setFormData((prev) => ({
      ...prev,
      brideCount: 1,
      bridesmaidCount: maids,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDFB] rounded-sm max-w-lg w-full nostalgic-border shadow-2xl p-6 space-y-6 relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EFE8E1] hover:bg-[#E4D9CE] text-[#3A3530] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 text-center">
          <div className="w-10 h-10 rounded-full bg-[#F8ECE8] text-[#8C786A] flex items-center justify-center mx-auto mb-2 border border-[#8C786A]/20">
            <Users className="w-5 h-5 stroke-1.5" />
          </div>
          <h3 className="serif text-2xl font-bold text-[#3A3530]">
            Configuración del Grupo de Despedida
          </h3>
          <p className="text-xs text-[#8C786A]">
            Ajusta el número de integrantes para calcular automáticamente las cantidades de la Novia y Damas.
          </p>
        </div>

        {/* Squad Size Quick Presets */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#8C786A] block text-center tracking-wider">
            Ajustes Rápidos
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Íntimo', count: 4, desc: '1 Novia + 4 Damas' },
              { label: 'Clásico', count: 7, desc: '1 Novia + 7 Damas' },
              { label: 'Gran Fiesta', count: 12, desc: '1 Novia + 12 Damas' },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p.count)}
                className={`p-2.5 rounded-xs border text-center transition-all cursor-pointer ${
                  formData.bridesmaidCount === p.count
                    ? 'border-[#8C786A] bg-[#8C786A] text-white shadow-xs'
                    : 'border-[#8C786A]/30 bg-[#F9F7F2] text-[#3A3530] hover:bg-[#EFE8E1]'
                }`}
              >
                <span className="text-xs font-semibold block">{p.label}</span>
                <span className="text-[10px] opacity-80 block">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Headcount Inputs */}
        <div className="grid grid-cols-2 gap-4 bg-[#F9F7F2] p-4 rounded-xs border border-[#8C786A]/20">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
              Número de Novias
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.brideCount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  brideCount: Math.max(1, parseInt(e.target.value) || 1),
                }))
              }
              className="w-full p-2 bg-white border border-[#8C786A]/30 text-xs font-mono font-bold text-[#3A3530] rounded-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
              Número de Damas / Acompañantes
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.bridesmaidCount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bridesmaidCount: Math.max(0, parseInt(e.target.value) || 0),
                }))
              }
              className="w-full p-2 bg-white border border-[#8C786A]/30 text-xs font-mono font-bold text-[#3A3530] rounded-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
                Nombre de la Novia
              </label>
              <input
                type="text"
                value={formData.brideName}
                onChange={(e) => setFormData((prev) => ({ ...prev, brideName: e.target.value }))}
                placeholder="ej. Sofia"
                className="w-full p-2 bg-[#F9F7F2] border border-[#8C786A]/30 text-xs text-[#3A3530] rounded-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
                Nombre del Novio
              </label>
              <input
                type="text"
                value={formData.groomName}
                onChange={(e) => setFormData((prev) => ({ ...prev, groomName: e.target.value }))}
                placeholder="ej. Mateo"
                className="w-full p-2 bg-[#F9F7F2] border border-[#8C786A]/30 text-xs text-[#3A3530] rounded-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
                Destino del Viaje
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                placeholder="ej. Tulum, México"
                className="w-full p-2 bg-[#F9F7F2] border border-[#8C786A]/30 text-xs text-[#3A3530] rounded-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
                Fecha del Evento
              </label>
              <input
                type="text"
                value={formData.eventDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, eventDate: e.target.value }))}
                placeholder="ej. Octubre 2026"
                className="w-full p-2 bg-[#F9F7F2] border border-[#8C786A]/30 text-xs text-[#3A3530] rounded-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 btn-secondary rounded-xs text-xs uppercase tracking-wider font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 btn-primary rounded-xs text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Check className="w-4 h-4" /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
