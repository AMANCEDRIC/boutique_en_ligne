import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'wishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistSubject: BehaviorSubject<Product[]>;
  wishlist$: Observable<Product[]>;

  constructor(private storageService: StorageService) {
    const initial = this.loadWishlist();
    this.wishlistSubject = new BehaviorSubject<Product[]>(initial);
    this.wishlist$ = this.wishlistSubject.asObservable();
  }

  private loadWishlist(): Product[] {
    const saved = this.storageService.getItem<Product[]>(STORAGE_KEY);
    if (saved) {
      try {
        return saved;
      } catch {
        return [];
      }
    }
    return [];
  }

  private saveWishlist(products: Product[]): void {
    this.storageService.setItem(STORAGE_KEY, products);
    this.wishlistSubject.next(products);
  }

  getAll(): Product[] {
    return this.wishlistSubject.value;
  }

  toggle(product: Product): void {
    const current = this.getAll();
    const exists = current.find((p) => p.id === product.id);

    if (exists) {
      this.saveWishlist(current.filter((p) => p.id !== product.id));
    } else {
      this.saveWishlist([...current, product]);
    }
  }

  isInWishlist(productId: string): boolean {
    return this.getAll().some((p) => p.id === productId);
  }
}

