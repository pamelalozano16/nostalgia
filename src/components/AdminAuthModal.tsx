import React, { useState } from 'react';
import { X, Lock, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { OwnerConfig } from '../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ownerConfig: OwnerConfig;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [inputCode, setInputCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Retrieve the configured ADMIN_CODE from environment variable (with fallback '1234')
  const envAdminCode = (
    import.meta.env.VITE_ADMIN_CODE ||
    (typeof process !== 'undefined' ? process.env.ADMIN_CODE : '')
  ).toString().trim();

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!inputCode.trim()) {
      setErrorMessage('Por favor ingresa la contraseña de administrador.');
      return;
    }

    if (inputCode.trim() === envAdminCode) {
      triggerSuccess();
    } else {
      setErrorMessage('La contraseña ingresada es incorrecta. Verifica la variable ADMIN_CODE en tu archivo .env.');
      console.log("prueba")
            console.log(process.env.ADMIN_CODE)
            console.log(envAdminCode)
    }
  };

  const triggerSuccess = () => {
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
      setInputCode('');
      onSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDFB] rounded-sm max-w-md w-full shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EFE8E1] hover:bg-[#E4D9CE] text-[#3A3530] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#F8ECE8] text-[#8C786A] flex items-center justify-center mx-auto border border-[#8C786A]/30">
            <ShieldCheck className="w-6 h-6 stroke-1.5" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C786A] font-bold block">
            Acceso Privado Administrador
          </span>
          <h3 className="serif text-2xl font-bold text-[#3A3530]">
            Contraseña de Administrador
          </h3>
          <p className="text-xs text-[#8C786A] max-w-xs mx-auto leading-relaxed">
            Ingresa tu clave de acceso definida en la variable <code className="font-mono bg-[#F9F7F2] px-1 py-0.5 rounded text-[#3A3530]">ADMIN_CODE</code> de tu archivo <code className="font-mono bg-[#F9F7F2] px-1 py-0.5 rounded text-[#3A3530]">.env</code> para administrar precios y catálogo.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
              Contraseña Administrador
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#8C786A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#8C786A]/30 rounded-xs text-sm font-mono text-center text-[#3A3530] focus:outline-none focus:border-[#8C786A]"
                autoFocus
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            className={`w-full py-3 btn-primary text-xs uppercase tracking-[0.2em] font-bold rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
              successAnimation ? 'bg-[#5B7563] text-white scale-102' : ''
            }`}
          >
            {successAnimation ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> ¡Acceso Concedido!
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Entrar al Administrador
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
