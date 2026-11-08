import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Category, Product, SECTIONS, SectionInfo, Size, sectionBySlug } from '../../models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

type Sort = 'newest' | 'price-asc' | 'price-desc';

/**
 * Catalogue. L'URL est la source de vérité des filtres :
 * /shop?section=perruques&category=bob&size=12"&filter=new|sale&q=robe&sort=price-asc
 */
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  sections = SECTIONS;
  allProducts: Product[] = [];
  allCategories: Category[] = [];
  filteredProducts: Product[] = [];
  loading = true;

  section: SectionInfo | undefined;
  categoryId = '';
  flag: 'new' | 'sale' | '' = '';
  size: Size | '' = '';
  q = '';
  sortBy: Sort = 'newest';

  /** Catégories proposées (celles de la rubrique active, sinon toutes). */
  categories: Category[] = [];
  sizes: Size[] = [];

  get title(): string {
    if (this.q) return `« ${this.q} »`;
    if (this.flag === 'new') return 'Nouveautés';
    if (this.flag === 'sale') return 'Déstockage';
    return this.section?.id ?? 'Collection';
  }

  get sizeTitle(): string {
    return this.section?.slug === 'perruques' ? 'Longueurs' : 'Tailles';
  }

  get hasFilters(): boolean {
    return !!(this.section || this.categoryId || this.flag || this.size || this.q);
  }

  ngOnInit(): void {
    combineLatest([this.productsService.products$, this.categoriesService.categories$, this.route.queryParamMap])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([products, categories, params]) => {
        this.allProducts = products;
        this.allCategories = categories;
        this.loading = false;

        // Compatibilité avec les anciens liens (?filter=vetements, ?category=Accessoires)
        const legacy = params.get('filter');
        const legacyCategory = params.get('category');
        this.section =
          sectionBySlug(params.get('section')) ??
          sectionBySlug(legacy) ??
          (legacyCategory === 'Accessoires' ? sectionBySlug('accessoires') : undefined);
        this.categoryId = legacyCategory === 'Accessoires' ? '' : legacyCategory ?? '';
        this.flag = legacy === 'new' || legacy === 'sale' ? legacy : '';
        this.size = params.get('size') ?? '';
        this.q = params.get('q') ?? '';
        const sort = params.get('sort') as Sort | null;
        this.sortBy = sort === 'price-asc' || sort === 'price-desc' ? sort : 'newest';

        // Une catégorie sans rubrique explicite fixe la rubrique
        const cat = categories.find((c) => c.id === this.categoryId);
        if (cat && !this.section) this.section = SECTIONS.find((s) => s.id === cat.section);

        this.applyFilters();
      });
  }

  private applyFilters(): void {
    const inSection = this.allProducts.filter((p) => !this.section || p.mainCategory === this.section.id);
    this.categories = this.allCategories.filter((c) => !this.section || c.section === this.section.id);

    const q = this.q.toLowerCase();
    let list = inSection.filter(
      (p) =>
        (!this.categoryId || p.categoryId === this.categoryId) &&
        (this.flag !== 'new' || p.isNew) &&
        (this.flag !== 'sale' || p.isSale) &&
        (!q || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q))
    );

    // Tailles proposées = celles des articles visibles (avant filtre de taille)
    this.sizes = [...new Set(list.flatMap((p) => p.sizes))].filter((s) => s !== 'TU');
    if (this.size) list = list.filter((p) => p.sizes.includes(this.size));

    if (this.sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (this.sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    // 'newest' : ordre Firestore (createdAt décroissant)

    // Les articles épuisés passent en fin de liste
    list = [...list.filter((p) => p.stock > 0), ...list.filter((p) => p.stock <= 0)];

    this.filteredProducts = list;
  }

  private nav(patch: Params, reset = false): void {
    const base: Params = reset
      ? {}
      : {
          section: this.section?.slug ?? null,
          category: this.categoryId || null,
          filter: this.flag || null,
          size: this.size || null,
          q: this.q || null,
          sort: this.sortBy === 'newest' ? null : this.sortBy,
        };
    this.router.navigate(['/shop'], { queryParams: { ...base, ...patch } });
  }

  setSection(slug: string | null): void {
    this.nav({ section: slug, category: null, size: null });
  }

  setCategory(id: string | null): void {
    this.nav({ category: id, size: null });
  }

  toggleSize(size: Size): void {
    this.nav({ size: this.size === size ? null : size });
  }

  onSortChange(sort: Sort): void {
    this.nav({ sort: sort === 'newest' ? null : sort });
  }

  clearAll(): void {
    this.nav({}, true);
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product, product.sizes[0] ?? 'TU');
  }

  onToggleWishlist(product: Product): void {
    this.wishlistService.toggle(product);
  }
}
