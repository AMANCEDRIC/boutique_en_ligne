import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../core/services/products.service';
import { SettingsService } from '../../core/services/settings.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { cldUrl } from '../../core/services/media.service';
import { Product, ProductMedia, SECTIONS, SectionInfo, ShopSettings } from '../../models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

const DEFAULT_HERO_VIDEO = 'https://videos.pexels.com/video-files/3744654/3744654-uhd_2560_1440_30fps.mp4';
const DEFAULT_HERO_POSTER =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000';

const DEFAULT_SECTION_IMAGES: Record<string, string> = {
  vetements: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
  accessoires: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000',
  perruques: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1000',
};

interface SectionRow {
  section: SectionInfo;
  products: Product[];
  banner?: ProductMedia;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private productsService = inject(ProductsService);
  private settingsService = inject(SettingsService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private destroyRef = inject(DestroyRef);

  sections = SECTIONS;
  settings!: ShopSettings;
  loading = true;
  newArrivals: Product[] = [];
  sale: Product[] = [];
  rows: SectionRow[] = [];

  private products: Product[] = [];

  get hero(): ProductMedia {
    return this.settings.heroMedia ?? { type: 'video', url: DEFAULT_HERO_VIDEO };
  }

  get heroPoster(): string {
    const h = this.settings.heroMedia;
    if (!h) return DEFAULT_HERO_POSTER;
    return h.type === 'video' ? cldUrl(h.url, 'so_0,f_jpg,q_auto,w_1600').replace(/\.[a-z0-9]+$/i, '.jpg') : '';
  }

  heroSrc(width: number): string {
    const h = this.hero;
    return h.type === 'video' ? cldUrl(h.url, 'q_auto') : cldUrl(h.url, `w_${width},f_auto,q_auto`);
  }

  sectionImage(s: SectionInfo): string {
    return cldUrl(this.settings.sectionImages?.[s.slug] || DEFAULT_SECTION_IMAGES[s.slug], 'w_900,f_auto,q_auto');
  }

  bannerSrc(m: ProductMedia): string {
    return cldUrl(m.url, 'w_1800,f_auto,q_auto');
  }

  ngOnInit(): void {
    this.settingsService.settings$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((s) => {
      this.settings = s;
      this.buildRows();
    });

    this.productsService.products$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((all) => {
      // Les articles épuisés restent dans la boutique mais ne sont pas mis en avant sur l'accueil
      this.products = all.filter((p) => p.stock > 0);
      all = this.products;
      this.loading = false;
      const fresh = all.filter((p) => p.isNew);
      this.newArrivals = (fresh.length >= 4 ? fresh : [...fresh, ...all.filter((p) => !p.isNew)]).slice(0, 8);
      this.sale = all.filter((p) => p.isSale).slice(0, 4);
      this.buildRows();
    });
  }

  private buildRows(): void {
    if (!this.settings) return;
    const banners = this.settings.banners ?? [];
    this.rows = SECTIONS.map((section, i) => ({
      section,
      products: this.products.filter((p) => p.mainCategory === section.id).slice(0, 4),
      banner: banners[i],
    })).filter((r) => r.products.length);
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product, product.sizes[0] ?? 'TU');
  }

  onToggleWishlist(product: Product): void {
    this.wishlistService.toggle(product);
  }
}
