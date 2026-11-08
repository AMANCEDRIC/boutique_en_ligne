import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from '@angular/fire/firestore';
import { Observable, ReplaySubject, map } from 'rxjs';
import { Category, DEFAULT_CATEGORIES } from '../../models/category.model';
import { MainCategory } from '../../models/product.model';
import { isFirebaseConfigured } from '../../../environments/environment';
import { slugify } from '../utils/format';
import { ProductsService } from './products.service';

function sortCategories(list: Category[]): Category[] {
  return [...list].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private firestore = inject(Firestore);
  private productsService = inject(ProductsService);
  private current: Category[] = [];
  private subject = new ReplaySubject<Category[]>(1);

  readonly categories$: Observable<Category[]> = this.subject.asObservable();

  constructor() {
    if (!isFirebaseConfigured) {
      this.emit(DEFAULT_CATEGORIES);
      return;
    }
    (collectionData(collection(this.firestore, 'categories'), { idField: 'id' }) as Observable<Category[]>).subscribe({
      next: (list) => this.emit(list),
      error: (err) => {
        console.error('Chargement des catégories impossible :', err);
        this.emit(DEFAULT_CATEGORIES);
      },
    });
  }

  private emit(list: Category[]): void {
    this.current = sortCategories(list);
    this.subject.next(this.current);
  }

  getAll(): Category[] {
    return this.current;
  }

  bySection$(section: MainCategory): Observable<Category[]> {
    return this.categories$.pipe(map((list) => list.filter((c) => c.section === section)));
  }

  getById(id: string | undefined): Category | undefined {
    return this.current.find((c) => c.id === id);
  }

  async add(name: string, section: MainCategory): Promise<void> {
    const id = slugify(name);
    if (!id) throw new Error('Nom de catégorie invalide.');
    if (this.current.some((c) => c.id === id)) throw new Error(`La catégorie « ${name} » existe déjà.`);
    const order = Math.max(0, ...this.current.filter((c) => c.section === section).map((c) => c.order)) + 1;
    await setDoc(doc(this.firestore, 'categories', id), { name: name.trim(), section, order });
  }

  /** L'id (slug) ne change pas : les liens et les articles restent valides. */
  async rename(category: Category, newName: string): Promise<void> {
    const name = newName.trim();
    if (!name || name === category.name) return;
    await updateDoc(doc(this.firestore, 'categories', category.id), { name });
    await this.productsService.renameCategoryOnProducts(category.id, name);
  }

  async remove(category: Category): Promise<void> {
    const used = this.productsService.getAll().filter((p) => p.categoryId === category.id).length;
    if (used > 0) {
      throw new Error(
        `Impossible de supprimer « ${category.name} » : ${used} article(s) l'utilisent encore. Déplacez-les d'abord.`
      );
    }
    await deleteDoc(doc(this.firestore, 'categories', category.id));
  }

  /** Au premier login admin, crée les catégories par défaut si la collection est vide. */
  async seedDefaultsIfEmpty(): Promise<void> {
    const snap = await getDocs(collection(this.firestore, 'categories'));
    if (!snap.empty) return;
    const batch = writeBatch(this.firestore);
    DEFAULT_CATEGORIES.forEach(({ id, ...c }) => batch.set(doc(this.firestore, 'categories', id), c));
    await batch.commit();
  }
}
