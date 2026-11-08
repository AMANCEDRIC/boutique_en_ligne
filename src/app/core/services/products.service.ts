import { Injectable, inject } from '@angular/core';
import {
  DocumentData,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from '@angular/fire/firestore';
import { Observable, ReplaySubject, map } from 'rxjs';
import { Product } from '../../models/product.model';
import { MOCK_PRODUCTS } from '../../constants/mock-products';
import { isFirebaseConfigured } from '../../../environments/environment';
import { slugify } from '../utils/format';

/** Données saisies dans le formulaire admin (sans id ni champs calculés). */
export type ProductInput = Omit<Product, 'id' | 'image' | 'createdAt' | 'reviews' | 'points'>;

/** Complète un document Firestore : `image` = 1re photo, `media` toujours présent. */
function normalize(p: Product): Product {
  const media = p.media?.length ? p.media : p.image ? [{ type: 'image' as const, url: p.image }] : [];
  const cover = media.find((m) => m.type === 'image')?.url ?? p.image ?? '';
  return { ...p, media, image: cover, sizes: p.sizes ?? [], stock: p.stock ?? 0 };
}

function demoProducts(): Product[] {
  return MOCK_PRODUCTS.map((p, i) =>
    normalize({ ...p, categoryId: slugify(p.category), createdAt: MOCK_PRODUCTS.length - i })
  );
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private firestore = inject(Firestore);
  private current: Product[] = [];
  private subject = new ReplaySubject<Product[]>(1);

  /** Catalogue en temps réel (émet après le premier chargement). */
  readonly products$: Observable<Product[]> = this.subject.asObservable();

  constructor() {
    if (!isFirebaseConfigured) {
      this.emit(demoProducts());
      return;
    }
    const q = query(collection(this.firestore, 'products'), orderBy('createdAt', 'desc'));
    (collectionData(q, { idField: 'id' }) as Observable<Product[]>)
      .pipe(map((list) => list.map(normalize)))
      .subscribe({
        next: (list) => this.emit(list),
        error: (err) => {
          console.error('Chargement des articles impossible :', err);
          this.emit([]);
        },
      });
  }

  private emit(list: Product[]): void {
    this.current = list;
    this.subject.next(list);
  }

  getAll(): Product[] {
    return this.current;
  }

  /** Suit un article par id ; émet `null` s'il n'existe pas. */
  watchById(id: string | null): Observable<Product | null> {
    return this.products$.pipe(map((list) => list.find((p) => p.id === id) ?? null));
  }

  async addProduct(input: ProductInput): Promise<void> {
    await addDoc(collection(this.firestore, 'products'), this.toDoc(input, Date.now()));
  }

  async updateProduct(id: string, input: ProductInput): Promise<void> {
    await updateDoc(doc(this.firestore, 'products', id), this.toDoc(input));
  }

  async setStock(id: string, stock: number): Promise<void> {
    await updateDoc(doc(this.firestore, 'products', id), { stock: Math.max(0, stock) });
  }

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'products', id));
  }

  /** Renomme la catégorie dénormalisée sur tous les articles concernés. */
  async renameCategoryOnProducts(categoryId: string, newName: string): Promise<void> {
    const affected = this.current.filter((p) => p.categoryId === categoryId);
    if (!affected.length) return;
    const batch = writeBatch(this.firestore);
    affected.forEach((p) => batch.update(doc(this.firestore, 'products', p.id), { category: newName }));
    await batch.commit();
  }

  /** Pousse les articles de démonstration dans Firestore (bouton admin, une seule fois). */
  async importDemoProducts(): Promise<void> {
    const batch = writeBatch(this.firestore);
    demoProducts().forEach(({ id, ...p }) => {
      batch.set(doc(collection(this.firestore, 'products')), { ...p, createdAt: Date.now() - Number(id) });
    });
    await batch.commit();
  }

  getTotalStock(): number {
    return this.current.reduce((sum, p) => sum + (p.stock || 0), 0);
  }

  private toDoc(input: ProductInput, createdAt?: number): DocumentData {
    const media = input.media ?? [];
    const image = media.find((m) => m.type === 'image')?.url ?? '';
    const data: DocumentData = { ...input, media, image };
    if (createdAt) data['createdAt'] = createdAt;
    return data;
  }
}
