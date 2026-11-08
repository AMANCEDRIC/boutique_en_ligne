import { CartItem } from './cart-item.model';

export type OrderStatus = 'En attente' | 'Expédié' | 'Livré' | 'Annulé';

export const ORDER_STATUSES: OrderStatus[] = ['En attente', 'Expédié', 'Livré', 'Annulé'];

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  selectedSize: string;
  quantity: number;
}

export interface Order {
  /** Id du document Firestore. */
  id: string;
  /** Référence courte communiquée à la cliente (ex. MS-K3F9Q). */
  ref: string;
  date: string;
  createdAt: number;
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string;
  customerAddress: string;
  customerDistrict?: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod?: string;
  /** true quand le stock des articles a été décompté (passage en Expédié/Livré). */
  stockDeducted?: boolean;
}

export function toOrderItem(item: CartItem): OrderItem {
  return {
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category,
    selectedSize: item.selectedSize,
    quantity: item.quantity,
  };
}
