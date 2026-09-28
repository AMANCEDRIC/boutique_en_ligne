import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product, Size, MainCategory, SubCategory } from '../../models';
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
  activeFilter: string = 'all'; // Peut être 'all', 'vetements', 'Accessoires', 'new', 'sale'
  selectedCategory: SubCategory | 'all' = 'all';
  selectedSize: Size | 'all' = 'all';
  sortBy: 'newest' | 'price-asc' | 'price-desc' = 'newest';

  // Liste des sous-catégories pour les filtres (exemple basique)
  availableCategories: SubCategory[] = ['Robes', 'Ensembles', 'Hauts', 'Bas', 'Sacs', 'Sandales', 'Bijoux', 'Premium'];
  availableSizes: Size[] = ['TU', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '37', '38', '39', '40'];

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productsService.products$.subscribe((products) => {
      this.allProducts = products;
      this.applyFilters();
    });

    this.route.queryParams.subscribe(params => {
      const filter = params['filter'];
      const category = params['category']; // Pour la recherche de sous-catégorie directe ou Accessoires

      if (filter) {
        this.activeFilter = filter;
      } else if (category === 'Accessoires') {
        this.activeFilter = 'Accessoires';
      } else {
        this.activeFilter = 'all';
      }
      
      // Si on a passé une catégorie spécifique (autre que Accessoires)
      if (category && category !== 'Accessoires' && this.availableCategories.includes(category as SubCategory)) {
        this.selectedCategory = category as SubCategory;
      } else {
        this.selectedCategory = 'all';
      }

      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.allProducts];

    // Filtre navbar
    if (this.activeFilter === 'new') {
      filtered = filtered.filter(p => p.isNew === true);
    } else if (this.activeFilter === 'sale') {
      filtered = filtered.filter(p => p.isSale === true);
    } else if (this.activeFilter === 'vetements') {
      filtered = filtered.filter(p => p.mainCategory === 'Vêtements');
    } else if (this.activeFilter === 'Accessoires') {
      filtered = filtered.filter(p => p.mainCategory === 'Accessoires');
    }

    // Filtre par sous-catégorie
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

  onFilterChange(filter: string): void {
    this.activeFilter = filter;
    this.selectedCategory = 'all';
    this.router.navigate(['/shop'], { 
      queryParams: { filter: filter === 'all' ? null : filter } 
    });
  }

  onCategoryChange(category: any): void {
    this.selectedCategory = category as SubCategory | 'all';
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
    const defaultSize: Size = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : 'TU';
    this.cartService.addToCart(product, defaultSize);
  }

  onToggleWishlist(product: Product): void {
    this.wishlistService.toggle(product);
  }
}

