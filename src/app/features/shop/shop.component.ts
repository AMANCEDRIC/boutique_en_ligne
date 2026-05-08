import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product, Size, Category } from '../../models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Filtres
  activeFilter: 'all' | 'new' | 'sale' = 'all';
  selectedCategory: Category | 'all' = 'all';
  selectedSize: Size | 'all' = 'all';
  sortBy: 'newest' | 'price-asc' | 'price-desc' = 'newest';

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Charger tous les produits
    this.productsService.products$.subscribe((products) => {
      this.allProducts = products;
      this.applyFilters();
    });

    // Lire les query params pour le filtre navbar
    this.route.queryParams.subscribe(params => {
      const filter = params['filter'];
      if (filter === 'new' || filter === 'sale') {
        this.activeFilter = filter;
      } else {
        this.activeFilter = 'all';
      }
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.allProducts];

    // Filtre principal (new, sale, all)
    if (this.activeFilter === 'new') {
      filtered = filtered.filter(p => p.isNew === true);
    } else if (this.activeFilter === 'sale') {
      filtered = filtered.filter(p => p.isSale === true);
    }

    // Filtre par catégorie
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Filtre par taille
    if (this.selectedSize !== 'all') {
      filtered = filtered.filter(p => p.sizes.includes(this.selectedSize as Size));
    }

    // Tri
    this.sortProducts(filtered);
    
    this.filteredProducts = filtered;
  }

  sortProducts(products: Product[]): void {
    switch (this.sortBy) {
      case 'newest':
        products.sort((a, b) => {
          const aNew = a.isNew ? 1 : 0;
          const bNew = b.isNew ? 1 : 0;
          return bNew - aNew;
        });
        break;
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
    }
  }

  onFilterChange(filter: 'all' | 'new' | 'sale'): void {
    this.activeFilter = filter;
    this.router.navigate(['/shop'], { 
      queryParams: { filter: filter === 'all' ? null : filter } 
    });
  }

  onCategoryChange(category: any): void {
    this.selectedCategory = category as Category | 'all';
    this.applyFilters();
  }


  onSizeChange(size: Size | 'all'): void {
    this.selectedSize = size;
    this.applyFilters();
  }

  toggleSize(sizeStr: string): void {
    const size = sizeStr as Size;
    if (this.selectedSize === size) {
      this.onSizeChange('all');
    } else {
      this.onSizeChange(size);
    }
  }

  onSortChange(sort: 'newest' | 'price-asc' | 'price-desc'): void {
    this.sortBy = sort;
    this.applyFilters();
  }

  onAddToCart(product: Product): void {
    const defaultSize: Size = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : 'M';
    this.cartService.addToCart(product, defaultSize);
  }

  onToggleWishlist(product: Product): void {
    this.wishlistService.toggle(product);
  }
}

