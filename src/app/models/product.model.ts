import { Review } from './review.model';

export type Category = 'Femme' | 'Homme' | 'Accessoires' | 'Nouveautés' | 'Premium';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
  sizes: Size[];
  stock: number;
  isNew?: boolean;
  isSale?: boolean;
  points?: number;
  reviews?: Review[];
}

