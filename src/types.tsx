export type ItemCategory = 
  | 'all'
  | 'apparel'
  | 'drinkware'
  | 'inside-jokes'
  | 'decor-and-accessories'
  | 'party-kits';

export interface CatalogItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: ItemCategory;
  /** Whether this item differentiates Bride vs Bridesmaids pricing/quantities */
  supportsSplit: boolean;
  /** Price for Bride version (if supportsSplit is true, else flat unit price) */
  bridePrice: number;
  /** Price per Bridesmaid version (if supportsSplit is true, else same as bridePrice) */
  bridesmaidPrice: number;
  /** Suggested minimum quantity or batch unit description (e.g. "per item", "set of 6") */
  unitLabel: string;
  imageUrl: string;
  badge?: string;
  isPopular?: boolean;
  colorOptions?: string[];
  customizationNotesPlaceholder?: string;
}

export interface CartPackageItem {
  id: string;
  item: CatalogItem;
  brideQty: number;
  bridesmaidQty: number;
  flatQty: number;
  customText?: string;
  selectedColor?: string;
  notes?: string;
}

export interface PartySetup {
  brideName: string;
  groomName: string;
  brideCount: number;
  bridesmaidCount: number;
  destination: string;
  eventDate: string;
  themeColor: string;
  insideJokesNotes: string;
  contactEmail: string;
  contactPhone: string;
}

export interface OwnerConfig {
  currencySymbol: string;
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  instagramHandle: string;
  contactEmail: string;
}
