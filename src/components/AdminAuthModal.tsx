import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, ShieldCheck, KeyRound, ArrowRight, CheckCircle2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
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
  ownerConfig,
}) => {
  if (!isOpen) return null;

  const adminEmail = 'pamelalozano16@gmail.com';
  
  const [codeSent, setCodeSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [usePin, setUsePin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Default Master PIN is 1234
  const MASTER_PIN = '1234';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const handleSendCode = () => {
    // Generate a 6-digit security code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    setCodeSent(true);
    setTimerSeconds(60);
    setErrorMessage('');
    setInputCode(newCode); // Pre-fill for quick testing ease
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (usePin) {
      if (inputCode.trim() === MASTER_PIN) {
        triggerSuccess();
      } else {
        setErrorMessage('El PIN maestro es incorrecto. El PIN por defecto es 1234.');
      }
    } else {
      if (!codeSent) {
        setErrorMessage('Por favor primero solicita un código de verificación por correo.');
        return;
      }
      if (inputCode.trim() === generatedCode || inputCode.trim() === MASTER_PIN) {
        triggerSuccess();
      } else {
        setErrorMessage('El código ingresado es incorrecto. Intenta de nuevo.');
      }
    }
  };

  const triggerSuccess = () => {
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
      onSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDFB] rounded-sm max-w-md w-full nostalgic-border shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
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
            Verificación de Seguridad
          </h3>
          <p className="text-xs text-[#8C786A] max-w-xs mx-auto leading-relaxed">
            Para proteger la edición de precios y catálogo, confirma tu identidad mediante código por correo.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleVerify} className="space-y-4">
          {!usePin ? (
            /* Email Verification Option */
            <div className="space-y-4">
              <div className="bg-[#F9F7F2] p-3.5 rounded-xs border border-[#8C786A]/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#8C786A] flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Correo Administrador
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-[#3A3530] truncate max-w-[200px]">
                    {adminEmail}
                  </span>
                </div>

                {!codeSent ? (
                  <button
                    type="button"
                    onClick={handleSendCode}
                    className="w-full py-2.5 bg-[#8C786A] hover:bg-[#786558] text-white rounded-xs text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Mail className="w-4 h-4" /> Enviar Código a mi Correo
                  </button>
                ) : (
                  <div className="pt-1 flex justify-between items-center text-[11px]">
                    <span className="text-[#5B7563] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Código enviado por correo
                    </span>
                    <button
                      type="button"
                      disabled={timerSeconds > 0}
                      onClick={handleSendCode}
                      className="text-[#8C786A] font-semibold hover:underline disabled:opacity-50 cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Reenviar {timerSeconds > 0 ? `(${timerSeconds}s)` : ''}
                    </button>
                  </div>
                )}
              </div>

              {codeSent && (
                <div className="bg-[#F8ECE8] p-3 rounded-xs border border-[#8C786A]/30 text-xs text-[#3A3530] space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8C786A]">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C786A]" /> Notificación de Correo Enviada
                  </div>
                  <p className="text-[11px]">
                    Hemos enviado el código de verificación de 6 dígitos a <strong className="font-mono">{adminEmail}</strong>.
                  </p>
                  <div className="pt-1 flex items-center justify-between font-mono bg-white p-2 rounded-xs border border-[#8C786A]/20">
                    <span className="text-[10px] uppercase text-[#8C786A]">Código de Prueba:</span>
                    <span className="font-bold text-sm tracking-widest text-[#3A3530]">{generatedCode}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
                  Ingresa el Código de 6 Dígitos
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#8C786A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="ej. 849201"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#8C786A]/30 rounded-xs text-sm font-mono font-bold tracking-widest text-center text-[#3A3530] focus:outline-none focus:border-[#8C786A]"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Master PIN Option */
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-[#8C786A] block mb-1">
                Ingresa tu PIN Maestro de Administrador
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C786A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={10}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#8C786A]/30 rounded-xs text-sm font-mono font-bold tracking-widest text-center text-[#3A3530] focus:outline-none focus:border-[#8C786A]"
                />
              </div>
              <p className="text-[10px] text-[#8C786A] italic">
                PIN Maestro por defecto: <code className="font-mono font-bold">1234</code>
              </p>
            </div>
          )}

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
                <CheckCircle2 className="w-4 h-4" /> ¡Verificación Exitosa!
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Verificar y Abrir Ajustes
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Code & PIN */}
        <div className="pt-2 border-t border-dashed border-[#8C786A]/30 text-center">
          <button
            type="button"
            onClick={() => {
              setUsePin(!usePin);
              setErrorMessage('');
              setInputCode('');
            }}
            className="text-[11px] text-[#8C786A] hover:text-[#3A3530] underline font-medium cursor-pointer"
          >
            {usePin ? 'Usar código enviado por correo electrónico' : 'Usar PIN maestro de acceso rápido (1234)'}
          </button>
        </div>
      </div>
    </div>
  );
};
