import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product, Size } from '../../models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  specialOffers: Product[] = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    const all = this.productsService.getAll();

    this.featuredProducts = [...all]
      .filter((p) => p.isNew || (p.points ?? 0) >= 50)
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
      .slice(0, 3);

    this.specialOffers = [...all]
      .filter((p) => p.isSale)
      .sort((a, b) => a.price - b.price)
      .slice(0, 4);
  }

  goShop(): void {
    this.router.navigateByUrl('/shop');
  }

  onAddToCart(product: Product): void {
    // Utiliser la première taille disponible ou 'M' par défaut
    const defaultSize: Size = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : 'M';
    this.cartService.addToCart(product, defaultSize);
  }

  onToggleWishlist(product: Product): void {
    this.wishlistService.toggle(product);
  }
}

