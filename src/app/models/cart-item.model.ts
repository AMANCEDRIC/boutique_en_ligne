import { Product, Size } from './product.model';

export interface CartItem extends Product {
  selectedSize: Size;
  quantity: number;
}

