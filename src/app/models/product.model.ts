import { Review } from './review.model';

/** Sections principales du site (fixes). Les sous-catégories sont gérées dans l'admin. */
export type MainCategory = 'Vêtements' | 'Accessoires' | 'Perruques';

/** Nom de sous-catégorie (dynamique, collection Firestore `categories`). */
export type SubCategory = string;

/** Taille, pointure ou longueur (ex. 'M', '38', '18"', 'TU'). */
export type Size = string;

export interface SectionInfo {
  id: MainCategory;
  slug: 'vetements' | 'accessoires' | 'perruques';
  /** Libellé du sélecteur sur la fiche produit. */
  sizeLabel: string;
}

export const SECTIONS: SectionInfo[] = [
  { id: 'Vêtements', slug: 'vetements', sizeLabel: 'Taille' },
  { id: 'Accessoires', slug: 'accessoires', sizeLabel: 'Taille' },
  { id: 'Perruques', slug: 'perruques', sizeLabel: 'Longueur' },
];

export function sectionBySlug(slug: string | null | undefined): SectionInfo | undefined {
  return SECTIONS.find((s) => s.slug === slug?.toLowerCase());
}

export function sectionById(id: MainCategory | undefined): SectionInfo | undefined {
  return SECTIONS.find((s) => s.id === id);
}

/** Préréglages de tailles proposés dans le formulaire admin. */
export const SIZE_PRESETS: { label: string; sizes: Size[] }[] = [
  { label: 'Vêtements', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { label: 'Pointures', sizes: ['36', '37', '38', '39', '40', '41'] },
  { label: 'Longueurs', sizes: ['10"', '12"', '14"', '16"', '18"', '20"', '22"', '24"', '26"', '28"', '30"'] },
  { label: 'Taille unique', sizes: ['TU'] },
];

export interface ProductMedia {
  type: 'image' | 'video';
  url: string;
  /** Identifiant Cloudinary (absent pour les images externes / démo). */
  publicId?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  /** URL de la photo de couverture (= 1re image de `media`). */
  image: string;
  media?: ProductMedia[];
  mainCategory?: MainCategory;
  /** Nom de la sous-catégorie (dénormalisé pour l'affichage). */
  category: SubCategory;
  /** Id (= slug) du document `categories/{id}`. */
  categoryId?: string;
  sizes: Size[];
  stock: number;
  isNew?: boolean;
  isSale?: boolean;
  points?: number;
  reviews?: Review[];
  createdAt?: number;
}

export function hasVideo(p: Product): boolean {
  return !!p.media?.some((m) => m.type === 'video');
}
