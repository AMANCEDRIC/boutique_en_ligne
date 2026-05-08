import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, Category } from '../../models/product.model';
import { Review } from '../../models/review.model';
import { MOCK_PRODUCTS } from '../../constants/mock-products';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'products_v2';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsSubject: BehaviorSubject<Product[]>;
  products$: Observable<Product[]>;

  constructor(private storageService: StorageService) {
    const initialProducts = this.loadInitialProducts();
    this.productsSubject = new BehaviorSubject<Product[]>(initialProducts);
    this.products$ = this.productsSubject.asObservable();
  }

  private loadInitialProducts(): Product[] {
    const stored = this.storageService.getItem<Product[]>(STORAGE_KEY);
    if (stored && stored.length > 0) {
      return stored;
    }
    // Initialiser avec les mocks
    this.storageService.setItem(STORAGE_KEY, MOCK_PRODUCTS);
    return MOCK_PRODUCTS;
  }

  private save(products: Product[]): void {
    this.storageService.setItem(STORAGE_KEY, products);
    this.productsSubject.next(products);
  }

  getAll(): Product[] {
    return this.productsSubject.value;
  }

  getProducts(): Product[] {
    return this.getAll();
  }

  getProductById(id: string | null): Product | null {
    if (!id) return null;
    return this.getAll().find((p) => p.id === id) || null;
  }

  addProduct(partial: { name: string; price: number; category: Category; description?: string }): void {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: partial.name,
      price: partial.price,
      category: partial.category,
      description: partial.description || '',
      image: 'https://picsum.photos/400/600',
      sizes: ['S', 'M', 'L'],
      stock: 10,
    };

    const updated = [...this.productsSubject.value, newProduct];
    this.save(updated);
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    const current = this.getAll();
    this.save(current.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }

  deleteProduct(id: string): void {
    const updated = this.productsSubject.value.filter((p) => p.id !== id);
    this.save(updated);
  }

  addReview(productId: string, review: Review): void {
    const current = this.getAll();
    this.save(
      current.map((p) =>
        p.id === productId
          ? { ...p, reviews: [...(p.reviews || []), review] }
          : p
      )
    );
  }

  getTotalStock(): number {
    return this.productsSubject.value.reduce((sum, p) => sum + p.stock, 0);
  }
}

