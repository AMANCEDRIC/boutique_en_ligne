import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../../core/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';
import { SettingsService } from '../../core/services/settings.service';
import { ModalService } from '../../core/services/modal.service';
import { cldUrl } from '../../core/services/media.service';
import { formatPrice } from '../../core/utils/format';
import { CartItem, Order, toOrderItem } from '../../models';
import { isFirebaseConfigured } from '../../../environments/environment';

const PAYMENT_METHODS = ['Paiement à la livraison', 'Mobile Money (Wave / Orange / MTN)'];

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private router = inject(Router);
  private cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private settings = inject(SettingsService);
  private modalService = inject(ModalService);
  private destroyRef = inject(DestroyRef);

  cartItems: CartItem[] = [];
  totalCart = 0;
  paymentMethods = PAYMENT_METHODS;
  formatPrice = formatPrice;

  customerName = '';
  customerPhone = '';
  customerWhatsapp = '';
  sameWhatsapp = true;
  customerDistrict = '';
  customerAddress = '';
  notes = '';
  paymentMethod = PAYMENT_METHODS[0];

  isSubmitting = false;

  ngOnInit(): void {
    this.cartService.items$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((items) => {
      this.cartItems = items;
      this.totalCart = this.cartService.getTotal();
    });
    if (this.cartItems.length === 0 && !this.isSubmitting) {
      this.router.navigateByUrl('/cart');
    }
  }

  thumb(url: string): string {
    return cldUrl(url, 'w_160,f_auto,q_auto');
  }

  async submitOrder(): Promise<void> {
    const missing = !this.customerName.trim()
      ? 'votre nom'
      : !this.customerPhone.trim()
        ? 'votre numéro de téléphone'
        : !this.customerAddress.trim()
          ? 'votre ville / adresse de livraison'
          : '';
    if (missing) {
      await this.modalService.alert(`Veuillez indiquer ${missing}.`, 'warning');
      return;
    }
    if (this.cartItems.length === 0) {
      await this.modalService.alert('Votre panier est vide.', 'warning');
      return;
    }

    this.isSubmitting = true;
    const now = new Date();
    const order: Omit<Order, 'id'> = {
      ref: this.ordersService.generateRef(),
      date: now.toISOString().split('T')[0],
      createdAt: now.getTime(),
      customerName: this.customerName.trim(),
      customerPhone: this.customerPhone.trim(),
      customerWhatsapp: (this.sameWhatsapp ? this.customerPhone : this.customerWhatsapp).trim(),
      customerDistrict: this.customerDistrict.trim(),
      customerAddress: this.customerAddress.trim(),
      notes: this.notes.trim(),
      items: this.cartItems.map(toOrderItem),
      total: this.totalCart,
      status: 'En attente',
      paymentMethod: this.paymentMethod,
    };

    // On enregistre la commande pour l'admin ; en cas d'échec réseau on envoie quand même
    // le message WhatsApp pour ne pas perdre la vente.
    if (isFirebaseConfigured) {
      try {
        await this.ordersService.addOrder(order);
      } catch (err) {
        console.error('Enregistrement de la commande impossible :', err);
      }
    }
    this.ordersService.rememberLastOrder(order);

    const url = this.settings.whatsappLink(this.ordersService.whatsappMessage(order));
    this.cartService.clearCart();
    // Page de confirmation d'abord : au retour de WhatsApp (bouton « précédent »), la cliente y revient.
    await this.router.navigate(['/order-confirmation', order.ref]);
    window.location.href = url;
  }

  goBack(): void {
    this.router.navigateByUrl('/cart');
  }
}
