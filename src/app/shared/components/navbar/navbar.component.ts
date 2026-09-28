import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartItem } from '../../../models/cart-item.model';
import { Product } from '../../../models/product.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  navFilter: string = 'all';
  cartCount = 0;
  wishlistCount = 0;
  cartTotal = 0;
  cartAnimating = false;

  // Mobile App Menu & Search State
  isMobileMenuOpen = false;
  isSearchOpen = false;
  searchQuery = '';
  currentRoute = '';

  // Scroll & route state
  isScrolled = false;
  isHidden = false;
  isHomePage = false;
  private lastScrollY = 0;

  // Transparent mode only on home page when not scrolled and drawer is closed
  get isTransparent(): boolean {
    return this.isHomePage && !this.isScrolled && !this.isMobileMenuOpen && !this.isSearchOpen;
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

    // Hide on scroll down, show on scroll up (only when drawer is closed)
    if (!this.isMobileMenuOpen && !this.isSearchOpen) {
      if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
        this.isHidden = true;
      } else {
        this.isHidden = false;
      }
    } else {
      this.isHidden = false;
    }
    this.lastScrollY = currentScrollY;
  }

  ngOnInit(): void {
    this.cartService.items$.subscribe((items: CartItem[]) => {
      const oldCount = this.cartCount;
      this.cartCount = items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
      this.cartTotal = this.cartService.getTotal();
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
        // Detect home page & current route
        const path = event.urlAfterRedirects || event.url;
        this.currentRoute = path;
        this.isHomePage = path === '/' || path === '';

        const url = new URL(event.url, window.location.origin);
        const filterParam = url.searchParams.get('filter');
        if (filterParam === 'new' || filterParam === 'sale') {
          this.navFilter = filterParam;
        } else {
          this.navFilter = 'all';
        }

        // Close mobile drawer on navigation change
        this.closeMobileMenu();
        this.isSearchOpen = false;
      });

    // Check on init
    const currentPath = window.location.pathname;
    this.currentRoute = currentPath;
    this.isHomePage = currentPath === '/' || currentPath === '';

    const url = new URL(window.location.href);
    const filterParam = url.searchParams.get('filter');
    if (filterParam === 'new' || filterParam === 'sale') {
      this.navFilter = filterParam;
    }
  }

  ngOnDestroy(): void {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isSearchOpen = false;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  onSearchSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (this.searchQuery.trim()) {
      this.router.navigate(['/shop'], {
        queryParams: { q: this.searchQuery.trim() }
      });
      this.isSearchOpen = false;
      this.closeMobileMenu();
    }
  }

  goCategory(cat: string): void {
    this.closeMobileMenu();
    this.router.navigate(['/shop'], {
      queryParams: { category: cat }
    });
  }

  goHome(): void {
    this.navFilter = 'all';
    this.closeMobileMenu();
    this.router.navigateByUrl('/');
  }

  goShop(filter: string): void {
    this.navFilter = filter;
    this.closeMobileMenu();
    this.router.navigate(['/shop'], {
      queryParams: { filter: filter === 'all' ? null : filter }
    });
  }

  goAdmin(): void {
    this.closeMobileMenu();
    this.router.navigateByUrl('/admin');
  }

  goWishlist(): void {
    this.closeMobileMenu();
    this.router.navigateByUrl('/wishlist');
  }

  goCart(): void {
    this.closeMobileMenu();
    this.router.navigateByUrl('/cart');
  }

  isRouteActive(route: string): boolean {
    if (route === '/' || route === '') {
      return this.currentRoute === '/' || this.currentRoute === '';
    }
    return this.currentRoute.startsWith(route);
  }
}

