import { ProductMedia } from './product.model';

export interface DeliveryZone {
  /** Ex. « Abidjan — Cocody, Plateau » */
  name: string;
  /** Texte libre : « 1 500 FCFA », « Sur devis »… */
  price: string;
  /** Texte libre : « 24 h », « 48 à 72 h »… */
  delay: string;
}

export interface ShopSettings {
  /** Numéro WhatsApp au format international, chiffres uniquement (ex. 2250700000000). */
  whatsappNumber: string;
  /** Numéro affiché sur la page Contact (format libre). */
  phone: string;
  tiktok: string;
  instagram: string;
  facebook: string;
  /** Photo ou vidéo du grand bandeau d'accueil. */
  heroMedia?: ProductMedia | null;
  /** Bannières photo affichées entre les sections de l'accueil. */
  banners: ProductMedia[];
  /** Photos des tuiles de section sur l'accueil, indexées par slug de section. */
  sectionImages: Record<string, string>;
  aboutImage?: string;
  /** Page Livraison */
  deliveryZones: DeliveryZone[];
  deliveryDelay: string;
  deliveryNote: string;
}

export const DEFAULT_SETTINGS: ShopSettings = {
  whatsappNumber: '33600000000',
  phone: '',
  tiktok: '',
  instagram: '',
  facebook: '',
  banners: [],
  sectionImages: {},
  deliveryZones: [
    { name: 'Abidjan — communes du centre', price: 'À confirmer', delay: '24 h' },
    { name: 'Abidjan — périphérie', price: 'À confirmer', delay: '24 à 48 h' },
    { name: 'Intérieur du pays', price: 'Sur devis', delay: '48 à 72 h' },
  ],
  deliveryDelay: '24 à 48 heures après validation de votre commande',
  deliveryNote:
    'Les frais exacts sont confirmés sur WhatsApp lors de la validation de votre commande, selon votre adresse précise.',
};
