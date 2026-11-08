import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, Product, SECTIONS } from '../../../../models';
import { formatPrice } from '../../../../core/utils/format';
import { AdminTab } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-stats.component.html',
})
export class AdminStatsComponent {
  @Input() products: Product[] = [];
  @Input() orders: Order[] = [];
  @Output() goTo = new EventEmitter<AdminTab>();

  formatPrice = formatPrice;
  sections = SECTIONS;

  get revenue(): number {
    return this.orders.filter((o) => o.status === 'Livré').reduce((s, o) => s + o.total, 0);
  }

  get pending(): Order[] {
    return this.orders.filter((o) => o.status === 'En attente');
  }

  get totalStock(): number {
    return this.products.reduce((s, p) => s + (p.stock || 0), 0);
  }

  get outOfStock(): Product[] {
    return this.products.filter((p) => (p.stock || 0) <= 0);
  }

  get lowStock(): Product[] {
    return this.products.filter((p) => p.stock > 0 && p.stock < 5);
  }

  countBySection(id: string): number {
    return this.products.filter((p) => p.mainCategory === id).length;
  }
}
