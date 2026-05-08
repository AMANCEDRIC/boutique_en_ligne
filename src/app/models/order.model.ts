import { CartItem } from './cart-item.model';

export type OrderStatus = 'En attente' | 'Expédié' | 'Livré' | 'Annulé';

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  customerEmail?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod?: string;
}


