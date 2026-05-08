import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';
import { Product, Size } from '../../models/product.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itemsSubject: BehaviorSubject<CartItem[]>;
  items$: Observable<CartItem[]>;

  constructor(private storageService: StorageService) {
    const initial = this.loadCart();
    this.itemsSubject = new BehaviorSubject<CartItem[]>(initial);
    this.items$ = this.itemsSubject.asObservable();
  }

  private loadCart(): CartItem[] {
    const saved = this.storageService.getItem<CartItem[]>(STORAGE_KEY);
    if (saved) {
      try {
        return saved;
      } catch {
        return [];
      }
    }
    return [];
  }

  private saveCart(items: CartItem[]): void {
    this.storageService.setItem(STORAGE_KEY, items);
    this.itemsSubject.next(items);
  }

  addToCart(product: Product, size: Size): void {
    const current = this.itemsSubject.value;
    const existing = current.find(
      (i) => i.id === product.id && i.selectedSize === size
    );

    if (existing) {
      existing.quantity += 1;
      this.saveCart([...current]);
    } else {
      const newItem: CartItem = {
        ...product,
        selectedSize: size,
        quantity: 1,
      };
      this.saveCart([...current, newItem]);
    }
  }

  updateQuantity(id: string, size: Size, delta: number): void {
    const current = this.itemsSubject.value;
    this.saveCart(
      current.map((item) => {
        if (item.id === id && item.selectedSize === size) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  }

  removeFromCart(id: string, size: Size): void {
    const current = this.itemsSubject.value;
    this.saveCart(
      current.filter((item) => !(item.id === id && item.selectedSize === size))
    );
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  getItemsSnapshot(): CartItem[] {
    return this.getItems();
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  clearCart(): void {
    this.saveCart([]);
  }
}


