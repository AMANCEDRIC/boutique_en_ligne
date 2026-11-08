import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';
import { SettingsService } from '../../core/services/settings.service';
import { cldUrl } from '../../core/services/media.service';
import { formatPrice } from '../../core/utils/format';
import { Order } from '../../models';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.component.html',
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordersService = inject(OrdersService);
  private settings = inject(SettingsService);

  /** Lue depuis sessionStorage : le public n'a pas accès en lecture à la collection `orders`. */
  order: Omit<Order, 'id'> | null = null;
  formatPrice = formatPrice;

  ngOnInit(): void {
    const ref = this.route.snapshot.paramMap.get('ref');
    const last = this.ordersService.getLastOrder();
    this.order = last && last.ref === ref ? last : null;
  }

  thumb(url: string): string {
    return cldUrl(url, 'w_160,f_auto,q_auto');
  }

  get whatsappLink(): string {
    return this.order ? this.settings.whatsappLink(this.ordersService.whatsappMessage(this.order)) : this.settings.whatsappLink();
  }

  goToShop(): void {
    this.router.navigateByUrl('/shop');
  }

  goToHome(): void {
    this.router.navigateByUrl('/');
  }
}
