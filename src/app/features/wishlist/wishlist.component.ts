import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../models';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  wishlist: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe((products) => {
      this.wishlist = products;
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  toggleWishlist(product: Product, event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggle(product);
  }

  goToProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  goToShop(): void {
    this.router.navigateByUrl('/shop');
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}

