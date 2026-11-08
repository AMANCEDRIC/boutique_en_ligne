import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ProductInput, ProductsService } from '../../../../core/services/products.service';
import { MediaUploaderComponent } from '../media-uploader/media-uploader.component';
import { Category, MainCategory, Product, ProductMedia, SECTIONS, SIZE_PRESETS, Size } from '../../../../models';

/** Formulaire d'ajout / modification d'un article (plein écran sur mobile, modal sur desktop). */
@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MediaUploaderComponent],
  templateUrl: './admin-product-form.component.html',
})
export class AdminProductFormComponent implements OnInit {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private destroyRef = inject(DestroyRef);

  /** Article à modifier ; `null` pour un nouvel article. */
  @Input() product: Product | null = null;
  @Output() closed = new EventEmitter<boolean>();

  sections = SECTIONS;
  presets = SIZE_PRESETS;
  categories: Category[] = [];

  name = '';
  price: number | null = null;
  section: MainCategory = 'Vêtements';
  categoryId = '';
  sizes: Size[] = [];
  customSize = '';
  stock: number | null = 1;
  description = '';
  isNew = true;
  isSale = false;
  media: ProductMedia[] = [];

  uploading = false;
  saving = false;
  error = '';

  get isEdit(): boolean {
    return !!this.product;
  }

  get sectionCategories(): Category[] {
    return this.categories.filter((c) => c.section === this.section);
  }

  /** Préréglages pertinents en premier selon la section. */
  get orderedPresets() {
    const first = this.section === 'Perruques' ? 'Longueurs' : this.section === 'Accessoires' ? 'Taille unique' : 'Vêtements';
    return [...this.presets].sort((a, b) => (a.label === first ? -1 : b.label === first ? 1 : 0));
  }

  get sizeLabel(): string {
    return this.section === 'Perruques' ? 'Longueurs disponibles' : 'Tailles disponibles';
  }

  ngOnInit(): void {
    this.categoriesService.categories$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((list) => {
      this.categories = list;
      if (!this.categoryId || !this.sectionCategories.some((c) => c.id === this.categoryId)) {
        this.categoryId = this.sectionCategories[0]?.id ?? '';
      }
    });

    const p = this.product;
    if (p) {
      this.name = p.name;
      this.price = p.price;
      this.section = p.mainCategory ?? 'Vêtements';
      this.categoryId = p.categoryId ?? '';
      this.sizes = [...p.sizes];
      this.stock = p.stock;
      this.description = p.description;
      this.isNew = !!p.isNew;
      this.isSale = !!p.isSale;
      this.media = [...(p.media ?? [])];
    }
  }

  onSectionChange(): void {
    this.categoryId = this.sectionCategories[0]?.id ?? '';
  }

  toggleSize(size: Size): void {
    this.sizes = this.sizes.includes(size) ? this.sizes.filter((s) => s !== size) : [...this.sizes, size];
  }

  applyPreset(sizes: Size[]): void {
    this.sizes = [...sizes];
  }

  addCustomSize(): void {
    const s = this.customSize.trim();
    if (s && !this.sizes.includes(s)) this.sizes = [...this.sizes, s];
    this.customSize = '';
  }

  async save(): Promise<void> {
    this.error = this.validate();
    if (this.error) return;

    const category = this.categories.find((c) => c.id === this.categoryId)!;
    const input: ProductInput = {
      name: this.name.trim(),
      price: Number(this.price),
      mainCategory: this.section,
      categoryId: category.id,
      category: category.name,
      sizes: this.sizes.length ? this.sizes : ['TU'],
      stock: Number(this.stock ?? 0),
      description: this.description.trim(),
      isNew: this.isNew,
      isSale: this.isSale,
      media: this.media,
    };

    this.saving = true;
    try {
      if (this.product) await this.productsService.updateProduct(this.product.id, input);
      else await this.productsService.addProduct(input);
      this.closed.emit(true);
    } catch (e) {
      this.error = 'Enregistrement impossible : ' + (e as Error).message;
    } finally {
      this.saving = false;
    }
  }

  private validate(): string {
    if (this.uploading) return 'Patientez jusqu’à la fin de l’envoi des médias.';
    if (!this.name.trim()) return 'Indiquez le nom de l’article.';
    if (!this.price || this.price <= 0) return 'Indiquez un prix valide.';
    if (!this.categoryId) return 'Choisissez une catégorie (créez-en une dans l’onglet Catégories si besoin).';
    if (!this.media.some((m) => m.type === 'image')) return 'Ajoutez au moins une photo (elle sert de couverture).';
    return '';
  }

  cancel(): void {
    this.closed.emit(false);
  }
}
