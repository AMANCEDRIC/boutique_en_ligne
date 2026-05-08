import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';
import { Order } from '../../models';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss',
})
export class OrderConfirmationComponent implements OnInit {
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
        // Si la commande n'existe pas, rediriger vers la boutique
        this.router.navigateByUrl('/shop');
      }
    } else {
      this.router.navigateByUrl('/shop');
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  goToShop(): void {
    this.router.navigateByUrl('/shop');
  }

  goToHome(): void {
    this.router.navigateByUrl('/');
  }
}

