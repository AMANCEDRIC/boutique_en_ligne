import { Review } from './review.model';

export type MainCategory = 'Vêtements' | 'Accessoires';
export type SubCategory = 'Robes' | 'Ensembles' | 'Hauts' | 'Bas' | 'Sacs' | 'Sandales' | 'Bijoux' | 'Nouveautés' | 'Déstockage' | 'Premium';
export type Size = 'TU' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '36' | '37' | '38' | '39' | '40' | '41';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  mainCategory?: MainCategory;
  category: SubCategory;
  sizes: Size[];
  stock: number;
  isNew?: boolean;
  isSale?: boolean;
  points?: number;
  reviews?: Review[];
}

