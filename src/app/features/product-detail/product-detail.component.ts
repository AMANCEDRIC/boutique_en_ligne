import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { SettingsService } from '../../core/services/settings.service';
import { ModalService } from '../../core/services/modal.service';
import { cldUrl, videoPoster } from '../../core/services/media.service';
import { formatPrice } from '../../core/utils/format';
import { Product, ProductMedia, Size, sectionById } from '../../models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private settings = inject(SettingsService);
  private modalService = inject(ModalService);
  private destroyRef = inject(DestroyRef);

  product: Product | null = null;
  related: Product[] = [];
  loading = true;
  selectedSize: Size | null = null;
  activeIndex = 0;
  formatPrice = formatPrice;

  get media(): ProductMedia[] {
    return this.product?.media ?? [];
  }

  get active(): ProductMedia | undefined {
    return this.media[this.activeIndex];
  }

  get sizeLabel(): string {
    return sectionById(this.product?.mainCategory)?.sizeLabel ?? 'Taille';
  }

  get soldOut(): boolean {
    return !!this.product && this.product.stock <= 0;
  }

  ngOnInit(): void {
    combineLatest([this.route.paramMap.pipe(map((p) => p.get('id'))), this.productsService.products$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([id, all]) => {
        const product = all.find((p) => p.id === id) ?? null;
        if (product?.id !== this.product?.id) {
          this.activeIndex = 0;
          this.selectedSize = product?.sizes.length === 1 ? product.sizes[0] : null;
        }
        this.product = product;
        this.loading = false;
        this.related = product
          ? all.filter((p) => p.id !== product.id && p.categoryId === product.categoryId).slice(0, 4)
          : [];
        if (this.related.length < 4 && product) {
          const more = all.filter(
            (p) => p.id !== product.id && p.mainCategory === product.mainCategory && !this.related.includes(p)
          );
          this.related = [...this.related, ...more].slice(0, 4);
        }
      });
  }

  src(m: ProductMedia, width: number): string {
    return m.type === 'video' ? cldUrl(m.url, 'q_auto') : cldUrl(m.url, `w_${width},f_auto,q_auto`);
  }

  poster(m: ProductMedia, width: number): string {
    return videoPoster(m.url, width) || this.product?.image || '';
  }

  show(i: number): void {
    this.activeIndex = i;
  }

  step(delta: number): void {
    const n = this.media.length;
    if (n) this.activeIndex = (this.activeIndex + delta + n) % n;
  }

  // Balayage horizontal sur mobile
  private touchX = 0;
  onTouchStart(e: TouchEvent): void {
    this.touchX = e.touches[0].clientX;
  }
  onTouchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.touchX;
    if (Math.abs(dx) > 50) this.step(dx < 0 ? 1 : -1);
  }

  selectSize(size: Size): void {
    this.selectedSize = size;
  }

  private ensureSize(): boolean {
    if (this.product && this.product.sizes.length > 0 && !this.selectedSize) {
      this.modalService.alert(`Veuillez choisir une ${this.sizeLabel.toLowerCase()}.`, 'warning');
      return false;
    }
    return true;
  }

  addToCart(): void {
    if (!this.product || this.soldOut || !this.ensureSize()) return;
    this.cartService.addToCart(this.product, this.selectedSize || 'TU');
    this.router.navigateByUrl('/cart');
  }

  orderOnWhatsapp(): void {
    if (!this.product || !this.ensureSize()) return;
    const p = this.product;
    const size = this.selectedSize ? ` (${this.sizeLabel} : ${this.selectedSize})` : '';
    const msg = `Bonjour Maison Shein, je souhaite commander : ${p.name}${size} — ${formatPrice(p.price)}\n${window.location.href}`;
    window.open(this.settings.whatsappLink(msg), '_blank');
  }

  /** Partage natif du téléphone si disponible, sinon WhatsApp. */
  async share(): Promise<void> {
    if (!this.product) return;
    const url = window.location.href;
    const text = `${this.product.name} — ${formatPrice(this.product.price)} chez Maison Shein`;
    if (navigator.share) {
      try {
        await navigator.share({ title: this.product.name, text, url });
        return;
      } catch (e) {
        if ((e as Error).name === 'AbortError') return; // partage annulé par l'utilisatrice
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank');
  }

  get deliveryDelay(): string {
    return this.settings.snapshot.deliveryDelay;
  }

  toggleWishlist(): void {
    if (this.product) this.wishlistService.toggle(this.product);
  }

  isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
  }

  onAddRelated(p: Product): void {
    this.cartService.addToCart(p, p.sizes[0] ?? 'TU');
  }

  onToggleRelated(p: Product): void {
    this.wishlistService.toggle(p);
  }
}
