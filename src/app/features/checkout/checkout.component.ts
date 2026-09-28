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
  paymentMethod = 'Paiement à la livraison';

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
      paymentMethod: this.paymentMethod,
    };

    // Sauvegarder la commande (pour le panel admin)
    this.ordersService.addOrder(newOrder);

    // Formater le message WhatsApp
    let message = `Bonjour Maison Shein, je souhaite valider ma commande (Réf: ${newOrder.id}) :\n\n`;
    
    this.cartItems.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (Taille: ${item.selectedSize}) - ${this.formatPrice(item.price * item.quantity)}\n`;
    });
    
    message += `\n*TOTAL : ${this.formatPrice(this.totalCart)}*\n\n`;
    message += `*Mes Coordonnées :*\n`;
    message += `Nom : ${this.customerName}\n`;
    message += `Téléphone : ${this.customerPhone}\n`;
    message += `Adresse : ${this.customerAddress}\n`;
    message += `Paiement souhaité : ${this.paymentMethod}\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/33600000000?text=${encodedMessage}`;

    // Vider le panier
    this.cartService.clearCart();

    this.isSubmitting = false;

    // Rediriger vers WhatsApp
    window.location.href = whatsappUrl;
  }

  goBack(): void {
    this.router.navigateByUrl('/cart');
  }
}

