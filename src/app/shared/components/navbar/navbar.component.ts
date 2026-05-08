import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartItem } from '../../../models/cart-item.model';
import { Product } from '../../../models/product.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  navFilter: 'all' | 'new' | 'sale' = 'all';
  cartCount = 0;
  wishlistCount = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Abonnement au panier
    this.cartService.items$.subscribe((items: CartItem[]) => {
      this.cartCount = items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
    });

    // Abonnement à la wishlist
    this.wishlistService.wishlist$.subscribe((products: Product[]) => {
      this.wishlistCount = products.length;
    });

    // Détecter le filtre actif depuis l'URL
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = new URL(event.url, window.location.origin);
        const filterParam = url.searchParams.get('filter');
        if (filterParam === 'new' || filterParam === 'sale') {
          this.navFilter = filterParam;
        } else {
          this.navFilter = 'all';
        }
      });

    // Vérifier le filtre initial
    const url = new URL(window.location.href);
    const filterParam = url.searchParams.get('filter');
    if (filterParam === 'new' || filterParam === 'sale') {
      this.navFilter = filterParam;
    }
  }

  goHome(): void {
    this.navFilter = 'all';
    this.router.navigateByUrl('/');
  }

  goShop(filter: 'all' | 'new' | 'sale'): void {
    this.navFilter = filter;
    this.router.navigate(['/shop'], { 
      queryParams: { filter: filter === 'all' ? null : filter } 
    });
  }

  goAdmin(): void {
    this.router.navigateByUrl('/admin');
  }

  goWishlist(): void {
    this.router.navigateByUrl('/wishlist');
  }

  goCart(): void {
    this.router.navigateByUrl('/cart');
  }
}

