import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Users, Heart, ArrowUpRight } from 'lucide-react';
import { PartySetup } from '../types';
import bacheloretteBoatImg from '../assets/images/cartagena.jpeg';

interface ParallaxHeroProps {
  partySetup: PartySetup;
  onOpenPartyModal: () => void;
  onOpenStoryModal: () => void;
}

// Particle interface for White Fairy Dust mouse effect
interface FairyDustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  rotation: number;
  maxLife: number;
  life: number;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  partySetup,
  onOpenPartyModal,
  onOpenStoryModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rawX: 50, rawY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // White Fairy Dust Particle State
  const [fairyDust, setFairyDust] = useState<FairyDustParticle[]>([]);
  const particleIdRef = useRef(0);

  // Scroll listener for true scroll parallax
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fairy Dust animation frame loop
  useEffect(() => {
    if (fairyDust.length === 0) return;

    const interval = setInterval(() => {
      setFairyDust((prevParticles) =>
        prevParticles
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY - 0.25, // Gentle floating upward
            opacity: Math.max(0, (1 - p.life / p.maxLife) * 0.95),
            life: p.life + 1,
            rotation: p.rotation + 2,
          }))
          .filter((p) => p.life < p.maxLife)
      );
    }, 25);

    return () => clearInterval(interval);
  }, [fairyDust]);

  // Smooth mouse movement and Fairy Dust spawning
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Centered coordinates [-1, 1]
    const normX = (x - 0.5) * 2;
    const normY = (y - 0.5) * 2;

    setMousePos({
      x: normX,
      y: normY,
      rawX: x * 100,
      rawY: y * 100,
    });
    setIsHovered(true);

    // Spawn 2-3 new white fairy dust particles at cursor position
    if (Math.random() > 0.3) {
      const newParticles: FairyDustParticle[] = [];
      const count = Math.floor(Math.random() * 2) + 2;

      for (let i = 0; i < count; i++) {
        particleIdRef.current += 1;
        newParticles.push({
          id: particleIdRef.current,
          x: clientX + (Math.random() * 20 - 10),
          y: clientY + (Math.random() * 20 - 10),
          size: Math.random() * 6 + 3, // 3px to 9px white sparkles
          opacity: 1,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5,
          rotation: Math.random() * 360,
          maxLife: Math.floor(Math.random() * 25) + 20, // 20 to 45 frames
          life: 0,
        });
      }

      setFairyDust((prev) => [...prev.slice(-30), ...newParticles]);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0, rawX: 50, rawY: 50 });
  };

  // Calculate Parallax offsets for background image
  const bgMouseOffsetX = mousePos.x * -25;
  const bgMouseOffsetY = mousePos.y * -25;
  const bgScrollOffsetY = scrollY * 0.22; // Smooth scroll depth

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[660px] sm:min-h-[720px] lg:min-h-[800px] bg-[#1a1412] text-[#FFFDFB] overflow-hidden select-none cursor-default py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-[#8C786A]/40"
      style={{
        perspective: '1200px',
      }}
    >
      {/* WHITE FAIRY DUST PARTICLES LAYER */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        {fairyDust.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.9)] flex items-center justify-center transition-opacity"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
            }}
          >
            {/* Inner diamond star glow shape for fairy dust magic */}
            {particle.size > 5 && (
              <span className="w-full h-full text-white flex items-center justify-center text-[8px] leading-none font-bold">
                ✦
              </span>
            )}
          </div>
        ))}
      </div>

      {/* WHITE FAIRY DUST GLOW SPOTLIGHT (Cursor Follower) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.9 : 0.25,
          background: `radial-gradient(600px circle at ${mousePos.rawX}% ${mousePos.rawY}%, rgba(255, 255, 255, 0.18), rgba(245, 235, 225, 0.08) 40%, transparent 70%)`,
        }}
      />

      {/* PARALLAX BACKGROUND LAYER */}
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out scale-105"
        style={{
          transform: `translate3d(${bgMouseOffsetX}px, ${bgMouseOffsetY + bgScrollOffsetY}px, 0px) scale(${isHovered ? 1.05 : 1.02})`,
        }}
      >
        <img
          src={bacheloretteBoatImg}
          alt="Despedida de Soltera en Yate - Nostalgia"
          className="w-full h-full object-cover object-[center_35%] filter brightness-[0.82] contrast-[1.05] saturate-[1.1]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[#1D1715]/30 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F1A18]/65 via-[#1F1A18]/20 to-[#1F1A18]/85" />
      </div>

      {/* FOREGROUND CONTENT OVERLAY */}
      <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-between">
        {/* Top Tag & Story Link */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDFB]/15 backdrop-blur-md text-[#FFFDFB] text-xs font-semibold tracking-widest uppercase border border-white/30 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E2C3AA] animate-pulse" />
            <span>Colección Despedida de Soltera • Nostalgia</span>
          </div>

          <button
            onClick={onOpenStoryModal}
            className="inline-flex items-center gap-1.5 text-xs text-[#FFFDFB] hover:text-[#E2C3AA] uppercase tracking-wider font-semibold cursor-pointer group transition-colors bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20"
          >
            <Heart className="w-3.5 h-3.5 text-[#E2C3AA] group-hover:scale-110 transition-transform" />
            <span>Nuestra Historia</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Content: Title, Description, and Headcount */}
        <div
          className="my-8 lg:my-12 max-w-3xl space-y-6 transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${-mousePos.y * 3}deg) rotateY(${mousePos.x * 3}deg) translate3d(${mousePos.x * 6}px, ${mousePos.y * 6}px, 0px)`,
          }}
        >
          {/* Main Title - Styled with Logo Fonts */}
          <div className="space-y-1">
            <span className="logo-script text-7xl sm:text-8xl lg:text-9xl text-[#E2C3AA] font-normal leading-none block drop-shadow-lg -mb-3 sm:-mb-5">
              Nostalgia
            </span>
            <h1 className="logo-serif text-2xl sm:text-4xl lg:text-5xl font-semibold uppercase tracking-[0.28em] text-[#FFFDFB] drop-shadow-md">
              Despedida de Soltera
            </h1>
          </div>

          {/* Description */}
          <p className="sans-font text-sm sm:text-base text-[#FAF6F0] max-w-xl leading-relaxed font-light drop-shadow-md bg-black/25 p-4 rounded-xs border-l-2 border-[#E2C3AA]/70 backdrop-blur-xs">
            Diseña tu paquete personalizado artículo por artículo. Tops bordados a la medida, termos mate, máscaras con la cara del novio y detalles retro inolvidables.
          </p>

          {/* NUMBER OF MEMBERS / SQUAD HEADCOUNT CARD */}
          <div className="bg-[#1D1715]/85 backdrop-blur-md p-4 sm:p-5 rounded-xs border border-[#E2C3AA]/50 flex flex-wrap items-center justify-between gap-4 max-w-2xl shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#8C786A] text-[#FFFDFB] flex items-center justify-center font-bold text-base shadow-inner border border-white/30 shrink-0 font-mono">
                {partySetup.brideCount + partySetup.bridesmaidCount}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#E2C3AA] tracking-widest">
                  <Users className="w-3.5 h-3.5 text-[#E2C3AA]" />
                  <span>Número de Integrantes</span>
                </div>
                <p className="sans-font text-sm sm:text-base font-semibold text-[#FFFDFB] mt-0.5">
                  Despedida de {partySetup.brideName || 'la Novia'}: {partySetup.brideCount} Novia + {partySetup.bridesmaidCount} Damas
                </p>
                <p className="text-[11px] text-[#E2C3AA]/80 font-mono mt-0.5">
                  Destino: {partySetup.destination || 'Tulum, MX'} • {partySetup.eventDate || '2026'}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenPartyModal}
              className="btn-primary px-4 py-2.5 rounded-xs text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-md hover:scale-105 transition-transform"
            >
              Cambiar Integrantes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

