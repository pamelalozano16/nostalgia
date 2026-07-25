import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, Heart, Users, ShoppingBag, CheckCircle, ArrowRight, Star, RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { ParallaxHero } from './components/ParallaxHero';
import { ItemCard } from './components/ItemCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { PackageSidebar } from './components/PackageSidebar';
import { PartySetupModal } from './components/PartySetupModal';
import { PackageSummaryModal } from './components/PackageSummaryModal';
import { AdminManagerModal } from './components/AdminManagerModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { StoryModal } from './components/StoryModal';

import { CatalogItem, CartPackageItem, PartySetup, OwnerConfig, ItemCategory } from './types';
import { INITIAL_ITEMS, INITIAL_OWNER_CONFIG, CATEGORIES_LIST } from './data/items';
import heroBannerImg from './assets/images/nostalgia_hero_banner_1784933629215.jpg';

export default function App() {
  // Load initial catalog items from LocalStorage or fall back to default
  const [items, setItems] = useState<CatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem('nostalgia_catalog_items');
      if (!saved) return INITIAL_ITEMS;
      const parsed: CatalogItem[] = JSON.parse(saved);
      return parsed.map((item) => {
        const init = INITIAL_ITEMS.find((i) => i.id === item.id);
        if (init) {
          return {
            ...item,
            title: init.title,
            subtitle: init.subtitle,
            description: init.description,
            unitLabel: init.unitLabel,
            badge: init.badge,
            colorOptions: init.colorOptions,
            customizationNotesPlaceholder: init.customizationNotesPlaceholder,
          };
        }
        return item;
      });
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [ownerConfig, setOwnerConfig] = useState<OwnerConfig>(() => {
    try {
      const saved = localStorage.getItem('nostalgia_owner_config');
      return saved ? JSON.parse(saved) : INITIAL_OWNER_CONFIG;
    } catch {
      return INITIAL_OWNER_CONFIG;
    }
  });

  const [partySetup, setPartySetup] = useState<PartySetup>({
    brideName: 'Sofia',
    groomName: 'Mateo',
    brideCount: 1,
    bridesmaidCount: 6,
    destination: 'Tulum, México',
    eventDate: 'Oct 2026',
    themeColor: 'Nude y Rosa Gold',
    insideJokesNotes: 'Fotos del novio de la preparatoria para las máscaras, frase "La Última y Nos Casamos" para pachitas',
    contactEmail: '',
    contactPhone: '',
  });

  // Package cart items state
  const [cartItems, setCartItems] = useState<CartPackageItem[]>(() => {
    const tank = INITIAL_ITEMS.find((i) => i.id === 'tank-tops');
    const bottles = INITIAL_ITEMS.find((i) => i.id === 'water-bottles');
    const result: CartPackageItem[] = [];

    if (tank) {
      result.push({
        id: 'tank-tops',
        item: tank,
        brideQty: 1,
        bridesmaidQty: 6,
        flatQty: 0,
      });
    }
    if (bottles) {
      result.push({
        id: 'water-bottles',
        item: bottles,
        brideQty: 1,
        bridesmaidQty: 6,
        flatQty: 0,
      });
    }
    return result;
  });

  // Category and search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPartyModalOpen, setIsPartyModalOpen] = useState<boolean>(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<CatalogItem | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('nostalgia_catalog_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('nostalgia_owner_config', JSON.stringify(ownerConfig));
  }, [ownerConfig]);

  // Handler to add or update item in package
  const handleAddToPackage = (
    item: CatalogItem,
    brideQty: number,
    bridesmaidQty: number,
    flatQty: number,
    notes?: string
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.item.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          brideQty,
          bridesmaidQty,
          flatQty,
          notes: notes || next[existingIndex].notes,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: item.id,
            item,
            brideQty,
            bridesmaidQty,
            flatQty,
            notes,
          },
        ];
      }
    });
  };

  const handleUpdateCartItemQty = (
    id: string,
    brideQty: number,
    bridesmaidQty: number,
    flatQty: number
  ) => {
    setCartItems((prev) =>
      prev.map((ci) =>
        ci.id === id ? { ...ci, brideQty, bridesmaidQty, flatQty } : ci
      )
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== id));
  };

  // Party setup update handler
  const handlePartySetupSave = (newSetup: PartySetup) => {
    setPartySetup(newSetup);

    // Sync quantities in existing cart items to match new headcount
    setCartItems((prev) =>
      prev.map((ci) => {
        if (ci.item.supportsSplit) {
          return {
            ...ci,
            brideQty: newSetup.brideCount,
            bridesmaidQty: newSetup.bridesmaidCount,
          };
        }
        return ci;
      })
    );
  };

  // Reset live catalog items to defaults
  const handleResetToDefaults = () => {
    if (confirm('¿Restablecer los artículos del catálogo a la lista original?')) {
      setItems(INITIAL_ITEMS);
      setOwnerConfig(INITIAL_OWNER_CONFIG);
      localStorage.removeItem('nostalgia_catalog_items');
      localStorage.removeItem('nostalgia_owner_config');
    }
  };

  // Filter items
  const filteredItems = items.filter((it) => {
    const matchesCategory =
      selectedCategory === 'all' || it.category === selectedCategory;
    const matchesSearch =
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (it.subtitle && it.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Total cart calculation
  const totalCartPrice = cartItems.reduce((sum, ci) => {
    if (ci.item.supportsSplit) {
      return sum + ci.brideQty * ci.item.bridePrice + ci.bridesmaidQty * ci.item.bridesmaidPrice;
    }
    return sum + ci.flatQty * ci.item.bridePrice;
  }, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2] text-[#3A3530] selection:bg-[#F8ECE8] selection:text-[#3A3530]">
      {/* Header */}
      <Header
        partySetup={partySetup}
        onOpenPartyModal={() => setIsPartyModalOpen(true)}
        onOpenCartDrawer={() => setIsCartOpen(true)}
        onOpenStoryModal={() => setIsStoryModalOpen(true)}
        onOpenAdminModal={() => setIsAdminAuthOpen(true)}
        cartItemCount={cartItems.length}
        totalPrice={totalCartPrice}
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Parallax Hero Section */}
      <ParallaxHero
        partySetup={partySetup}
        onOpenPartyModal={() => setIsPartyModalOpen(true)}
        onOpenStoryModal={() => setIsStoryModalOpen(true)}
      />

      {/* Catalogue & Sidebar Layout */}
      <main id="catalogue" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Catalog Area */}
          <div className="flex-1 w-full space-y-8">
            {/* Catalog Controls Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-dashed border-[#8C786A]/20">
              <div>
                <h2 className="serif text-3xl font-semibold text-[#3A3530]">
                  Selecciona Tus Artículos
                </h2>
                <p className="text-xs text-[#8C786A] italic font-serif mt-1">
                  Agrega productos a tu paquete. Las cantidades se multiplican automáticamente según el número de novia y damas.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#8C786A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos, stickers..."
                  className="w-full pl-9 pr-3 py-2 bg-white shadow-2xs rounded-xs text-xs focus:outline-none focus:ring-1 focus:ring-[#8C786A]"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xs text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#8C786A] text-white shadow-xs'
                      : 'bg-white text-[#3A3530] hover:bg-[#EFE8E1] shadow-2xs'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xs shadow-xs p-8 space-y-3">
                <p className="serif text-xl text-[#8C786A] italic">No se encontraron productos que coincidan con tu búsqueda</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="btn-secondary px-4 py-2 rounded-xs text-xs font-semibold uppercase tracking-wider"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const cartMatch = cartItems.find((ci) => ci.item.id === item.id);
                  const inCartQty = cartMatch
                    ? {
                        brideQty: cartMatch.brideQty,
                        bridesmaidQty: cartMatch.bridesmaidQty,
                        flatQty: cartMatch.flatQty,
                      }
                    : undefined;

                  return (
                    <ItemCard
                      key={item.id}
                      item={item}
                      partySetup={partySetup}
                      inCartQty={inCartQty}
                      onAddToPackage={handleAddToPackage}
                      onOpenDetail={(it) => setSelectedDetailItem(it)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Sticky Desktop Package Summary Preview Sidebar */}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#3A3530] text-[#F9F7F2] py-12 border-t border-[#8C786A]/40 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-[#8C786A]/30">
            {/* Logo */}
            <div className="flex flex-col items-center md:items-start">
              <span className="script-font text-3xl text-[#E2C3AA] -mb-3">Nostalgia</span>
              <span className="serif text-xl tracking-[0.3em] uppercase font-bold text-[#F9F7F2]">
                NOSTALGIA
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#DDB892] mt-0.5">
                Creando Recuerdos Inolvidables para la Novia
              </span>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-6 text-xs uppercase tracking-wider text-[#DDB892]">
              <button onClick={() => setIsStoryModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                Nuestra Historia
              </button>
              <button onClick={() => setIsPartyModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                Configurar Grupo
              </button>
              <button onClick={() => setIsAdminAuthOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                Administrador de Precios
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#DDB892]/70 gap-4">
            <p>© {new Date().getFullYear()} Nostalgia Despedidas. Todos los derechos reservados.</p>
            <p className="italic serif">
              "Qué privilegio sentir nostalgia por una vida llena de momentos que sí valieron la pena."
            </p>
          </div>
        </div>
      </footer>

      {/* Slide-over Package Sidebar */}
      <PackageSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        partySetup={partySetup}
        onUpdatePartySetup={(upd) => setPartySetup((prev) => ({ ...prev, ...upd }))}
        onUpdateCartItemQty={handleUpdateCartItemQty}
        onRemoveCartItem={handleRemoveCartItem}
        onOpenPartyModal={() => {
          setIsCartOpen(false);
          setIsPartyModalOpen(true);
        }}
        onOpenSummaryModal={() => {
          setIsCartOpen(false);
          setIsSummaryModalOpen(true);
        }}
      />

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        partySetup={partySetup}
        onAddToPackage={handleAddToPackage}
      />

      {/* Party Setup Headcount Modal */}
      <PartySetupModal
        isOpen={isPartyModalOpen}
        onClose={() => setIsPartyModalOpen(false)}
        partySetup={partySetup}
        onSave={handlePartySetupSave}
      />

      {/* Package Quote Summary Modal */}
      <PackageSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        cartItems={cartItems}
        partySetup={partySetup}
        ownerConfig={ownerConfig}
      />

      {/* Story & Vibe Modal */}
      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />

      {/* Admin Verification Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => {
          setIsAdminAuthOpen(false);
          setIsAdminModalOpen(true);
        }}
        ownerConfig={ownerConfig}
      />

      {/* Owner Catalog & Price Manager Modal */}
      <AdminManagerModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        items={items}
        ownerConfig={ownerConfig}
        onUpdateItems={setItems}
        onUpdateOwnerConfig={setOwnerConfig}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
}
