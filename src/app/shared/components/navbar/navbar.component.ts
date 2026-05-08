import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
export class NavbarComponent implements OnInit, OnDestroy {
  navFilter: 'all' | 'new' | 'sale' = 'all';
  cartCount = 0;
  wishlistCount = 0;
  cartAnimating = false;

  // Scroll & route state
  isScrolled = false;
  isHidden = false;
  isHomePage = false;
  private lastScrollY = 0;

  // Transparent mode only on home page when not scrolled
  get isTransparent(): boolean {
    return this.isHomePage && !this.isScrolled;
  }

  constructor(
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScrollY = window.scrollY;
    this.isScrolled = currentScrollY > 40;

    // Hide on scroll down, show on scroll up
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      this.isHidden = true;
    } else {
      this.isHidden = false;
    }
    this.lastScrollY = currentScrollY;
  }

  ngOnInit(): void {
    this.cartService.items$.subscribe((items: CartItem[]) => {
      const oldCount = this.cartCount;
      this.cartCount = items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
      if (this.cartCount > oldCount) {
        this.cartAnimating = true;
        setTimeout(() => this.cartAnimating = false, 400);
      }
    });

    this.wishlistService.wishlist$.subscribe((products: Product[]) => {
      this.wishlistCount = products.length;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Detect home page
        const path = event.urlAfterRedirects || event.url;
        this.isHomePage = path === '/' || path === '';

        const url = new URL(event.url, window.location.origin);
        const filterParam = url.searchParams.get('filter');
        if (filterParam === 'new' || filterParam === 'sale') {
          this.navFilter = filterParam;
        } else {
          this.navFilter = 'all';
        }
      });

    // Check on init
    const currentPath = window.location.pathname;
    this.isHomePage = currentPath === '/' || currentPath === '';

    const url = new URL(window.location.href);
    const filterParam = url.searchParams.get('filter');
    if (filterParam === 'new' || filterParam === 'sale') {
      this.navFilter = filterParam;
    }
  }

  ngOnDestroy(): void {}

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

