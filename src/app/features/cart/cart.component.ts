import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem, Size } from '../../models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalCart = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.cartItems = items;
      this.totalCart = this.cartService.getTotal();
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  updateQuantity(item: CartItem, delta: number): void {
    this.cartService.updateQuantity(item.id, item.selectedSize, delta);
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.id, item.selectedSize);
  }

  goToShop(): void {
    this.router.navigateByUrl('/shop');
  }

  goToCheckout(): void {
    this.router.navigateByUrl('/checkout');
  }
}

