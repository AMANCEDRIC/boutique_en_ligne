import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';
import { ModalService } from '../../core/services/modal.service';
import { CartItem, Order } from '../../models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalCart = 0;

  // Formulaire
  customerName = '';
  customerEmail = '';
  customerPhone = '';
  customerAddress = '';

  isSubmitting = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private ordersService: OrdersService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.cartItems = items;
      this.totalCart = this.cartService.getTotal();
    });

    // Rediriger si le panier est vide
    if (this.cartItems.length === 0) {
      this.router.navigateByUrl('/cart');
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  async submitOrder(): Promise<void> {
    // Validation
    if (!this.customerName.trim()) {
      await this.modalService.alert('Veuillez saisir votre nom.', 'warning');
      return;
    }

    if (!this.customerPhone.trim()) {
      await this.modalService.alert('Veuillez saisir votre numéro de téléphone.', 'warning');
      return;
    }

    if (!this.customerAddress.trim()) {
      await this.modalService.alert('Veuillez saisir votre adresse (localité).', 'warning');
      return;
    }

    if (this.cartItems.length === 0) {
      await this.modalService.alert('Votre panier est vide.', 'warning');
      return;
    }

    this.isSubmitting = true;

    // Créer la commande
    const newOrder: Order = {
      id: this.ordersService.generateOrderId(),
      date: new Date().toISOString().split('T')[0],
      customerName: this.customerName.trim(),
      customerPhone: this.customerPhone.trim(),
      customerAddress: this.customerAddress.trim(),
      customerEmail: this.customerEmail.trim(),
      items: [...this.cartItems],
      total: this.totalCart,
      status: 'En attente',
    };


    // Sauvegarder la commande
    this.ordersService.addOrder(newOrder);

    // Vider le panier
    this.cartService.clearCart();

    // Rediriger vers la page de confirmation
    this.router.navigate(['/order-confirmation', newOrder.id]);
  }

  goBack(): void {
    this.router.navigateByUrl('/cart');
  }
}

