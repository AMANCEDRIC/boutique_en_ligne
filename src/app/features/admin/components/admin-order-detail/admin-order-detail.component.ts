import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrdersService } from '../../../../core/services/orders.service';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { Order, OrderStatus } from '../../../../models';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebarComponent],
  templateUrl: './admin-order-detail.component.html',
  styleUrl: './admin-order-detail.component.scss',
})
export class AdminOrderDetailComponent implements OnInit {
  order: Order | null = null;
  orderId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    
    if (this.orderId) {
      this.order = this.ordersService.getById(this.orderId);
      
      if (!this.order) {
        this.router.navigateByUrl('/admin');
      }
    } else {
      this.router.navigateByUrl('/admin');
    }

    // S'abonner aux changements de commandes
    this.ordersService.orders$.subscribe(() => {
      if (this.orderId) {
        this.order = this.ordersService.getById(this.orderId);
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  goBack(): void {
    this.router.navigateByUrl('/admin');
  }

  updateStatus(newStatus: OrderStatus): void {
    if (this.order && this.orderId) {
      this.ordersService.updateOrderStatus(this.orderId, newStatus);
    }
  }
}

