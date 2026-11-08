import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ORDER_STATUSES, Order, OrderStatus } from '../../../../models';
import { formatPrice, whatsappUrl } from '../../../../core/utils/format';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-orders.component.html',
})
export class AdminOrdersComponent {
  @Input() orders: Order[] = [];
  @Output() updateStatus = new EventEmitter<{ id: string; status: OrderStatus }>();

  statuses = ORDER_STATUSES;
  statusFilter: OrderStatus | 'all' = 'En attente';
  formatPrice = formatPrice;

  get filtered(): Order[] {
    return this.statusFilter === 'all' ? this.orders : this.orders.filter((o) => o.status === this.statusFilter);
  }

  count(status: OrderStatus): number {
    return this.orders.filter((o) => o.status === status).length;
  }

  itemCount(o: Order): number {
    return o.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  }

  chatLink(o: Order): string {
    return whatsappUrl(o.customerWhatsapp || o.customerPhone, `Bonjour ${o.customerName}, c'est Maison Shein concernant votre commande ${o.ref}.`);
  }

  statusClass(s: OrderStatus): string {
    return {
      'En attente': 'border-maison-gold/60 text-[#8a6d00] bg-maison-gold/10',
      Expédié: 'border-blue-200 text-blue-600 bg-blue-50',
      Livré: 'border-green-200 text-green-700 bg-green-50',
      Annulé: 'border-red-200 text-red-600 bg-red-50',
    }[s];
  }

  set(o: Order, status: OrderStatus): void {
    this.updateStatus.emit({ id: o.id, status });
  }
}
