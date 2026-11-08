import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrdersService } from '../../../../core/services/orders.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ModalService } from '../../../../core/services/modal.service';
import { cldUrl } from '../../../../core/services/media.service';
import { formatPrice, whatsappUrl } from '../../../../core/utils/format';
import { AdminSidebarComponent, AdminTab } from '../admin-sidebar/admin-sidebar.component';
import { ORDER_STATUSES, Order, OrderStatus } from '../../../../models';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebarComponent],
  templateUrl: './admin-order-detail.component.html',
})
export class AdminOrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordersService = inject(OrdersService);
  private auth = inject(AuthService);
  private modal = inject(ModalService);
  private destroyRef = inject(DestroyRef);

  order: Order | null = null;
  loading = true;
  statuses = ORDER_STATUSES;
  formatPrice = formatPrice;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.goTab('orders');
      return;
    }
    this.ordersService
      .watchById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (o) => {
          this.order = o;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  thumb(url: string): string {
    return cldUrl(url, 'w_160,f_auto,q_auto');
  }

  get chatLink(): string {
    const o = this.order;
    if (!o) return '';
    return whatsappUrl(o.customerWhatsapp || o.customerPhone, `Bonjour ${o.customerName}, c'est Maison Shein concernant votre commande ${o.ref}.`);
  }

  get callLink(): string {
    return 'tel:' + (this.order?.customerPhone || '').replace(/[^\d+]/g, '');
  }

  async updateStatus(status: OrderStatus): Promise<void> {
    if (!this.order) return;
    try {
      await this.ordersService.updateOrderStatus(this.order, status);
    } catch (e) {
      this.modal.alert('Mise à jour impossible : ' + (e as Error).message, 'error');
    }
  }

  goTab(tab: AdminTab): void {
    this.router.navigate(['/admin'], { queryParams: { tab } });
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
