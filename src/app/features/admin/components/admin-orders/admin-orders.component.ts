import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Order, OrderStatus } from '../../../../models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss',
})
export class AdminOrdersComponent {
  @Input() orders: Order[] = [];
  @Input() formatPriceFn!: (price: number) => string;
  @Output() updateStatus = new EventEmitter<{ id: string; status: OrderStatus }>();

  onUpdateStatus(id: string, status: OrderStatus): void {
    this.updateStatus.emit({ id, status });
  }
}

