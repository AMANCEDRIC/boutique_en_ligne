import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminSidebarComponent, AdminTab, ADMIN_TABS } from './components/admin-sidebar/admin-sidebar.component';
import { AdminStatsComponent } from './components/admin-stats/admin-stats.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminCategoriesComponent } from './components/admin-categories/admin-categories.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { ProductsService } from '../../core/services/products.service';
import { OrdersService } from '../../core/services/orders.service';
import { CategoriesService } from '../../core/services/categories.service';
import { AuthService } from '../../core/services/auth.service';
import { ModalService } from '../../core/services/modal.service';
import { Order, OrderStatus, Product } from '../../models';
import { formatPrice } from '../../core/utils/format';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    AdminSidebarComponent,
    AdminStatsComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    AdminCategoriesComponent,
    AdminSettingsComponent,
  ],
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent implements OnInit {
  private productsService = inject(ProductsService);
  private ordersService = inject(OrdersService);
  private categoriesService = inject(CategoriesService);
  private auth = inject(AuthService);
  private modal = inject(ModalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  activeTab: AdminTab = 'stats';
  formatPrice = formatPrice;
  products: Product[] = [];
  orders: Order[] = [];

  get title(): string {
    return ADMIN_TABS.find((t) => t.id === this.activeTab)?.label ?? '';
  }

  get pendingOrders(): number {
    return this.orders.filter((o) => o.status === 'En attente').length;
  }

  ngOnInit(): void {
    const tab = this.route.snapshot.queryParamMap.get('tab') as AdminTab | null;
    if (tab && ADMIN_TABS.some((t) => t.id === tab)) this.activeTab = tab;

    this.productsService.products$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((p) => (this.products = p));

    this.ordersService
      .watchAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (o) => {
          this.detectNewOrders(o);
          this.orders = o;
          this.updateTitle();
        },
        error: (err) => console.error('Lecture des commandes impossible :', err),
      });

    this.categoriesService.seedDefaultsIfEmpty().catch((err) => console.error(err));
  }

  // --- Alerte nouvelle commande -------------------------------------------
  newOrder: Order | null = null;
  private knownOrderIds: Set<string> | null = null;
  private toastTimer?: ReturnType<typeof setTimeout>;

  /** Au 1er chargement on mémorise les commandes existantes ; ensuite toute nouvelle commande déclenche l'alerte. */
  private detectNewOrders(list: Order[]): void {
    if (!this.knownOrderIds) {
      this.knownOrderIds = new Set(list.map((o) => o.id));
      return;
    }
    const fresh = list.filter((o) => !this.knownOrderIds!.has(o.id));
    fresh.forEach((o) => this.knownOrderIds!.add(o.id));
    if (!fresh.length) return;
    this.newOrder = fresh[0];
    this.playChime();
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.newOrder = null), 15000);
  }

  private updateTitle(): void {
    const n = this.pendingOrders;
    document.title = n ? `(${n}) Commandes — Maison Shein` : 'Admin — Maison Shein';
  }

  private playChime(): void {
    try {
      const ctx = new AudioContext();
      [880, 1320].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.connect(gain).connect(ctx.destination);
        const t = ctx.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.4);
      });
      if ('vibrate' in navigator) navigator.vibrate(200);
    } catch {
      /* son indisponible : la bannière suffit */
    }
  }

  openNewOrder(): void {
    if (this.newOrder) this.router.navigate(['/admin/order', this.newOrder.id]);
    this.newOrder = null;
  }

  setActiveTab(tab: AdminTab): void {
    this.activeTab = tab;
    this.router.navigate([], { queryParams: { tab }, replaceUrl: true });
    window.scrollTo({ top: 0 });
  }

  async onUpdateOrderStatus(event: { id: string; status: OrderStatus }): Promise<void> {
    try {
      const order = this.orders.find((o) => o.id === event.id);
      if (order) await this.ordersService.updateOrderStatus(order, event.status);
    } catch (e) {
      this.modal.alert('Mise à jour impossible : ' + (e as Error).message, 'error');
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
