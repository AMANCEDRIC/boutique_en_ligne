import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ModalService } from '../../core/services/modal.service';
import { Product, Size } from '../../models/product.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  selectedSize: Size | null = null;

  reviewName = '';
  reviewRating = 5;
  reviewComment = '';
  isSubmittingReview = false;

  aiReviewSummary = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.product = this.productsService.getProductById(id);

    if (!this.product) {
      this.router.navigateByUrl('/shop');
      return;
    }

    if (this.product.sizes.length > 0) {
      this.selectedSize = this.product.sizes[0];
    }
    this.updateAiSummary();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  selectSize(size: Size): void {
    this.selectedSize = size;
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }
    if (this.product.sizes.length > 0 && !this.selectedSize) {
      this.modalService.alert(
        "Veuillez sélectionner une taille avant d'ajouter au panier.",
        'warning'
      );
      return;
    }
    const size = (this.selectedSize || 'M') as Size;
    this.cartService.addToCart(this.product, size);
    this.router.navigateByUrl('/cart');
  }

  submitReview(): void {
    if (!this.product || !this.reviewName || !this.reviewComment) {
      return;
    }

    this.isSubmittingReview = true;
    const newReview: Review = {
      id: Math.random().toString(36).substring(2, 9),
      user: this.reviewName,
      rating: this.reviewRating,
      comment: this.reviewComment,
      date: new Date().toISOString().split('T')[0],
    };

    this.productsService.addReview(this.product.id, newReview);
    this.product = this.productsService.getProductById(this.product.id);
    this.updateAiSummary();

    setTimeout(() => {
      this.reviewName = '';
      this.reviewComment = '';
      this.reviewRating = 5;
      this.isSubmittingReview = false;
    }, 300);
  }

  private updateAiSummary(): void {
    if (!this.product || !this.product.reviews || this.product.reviews.length === 0) {
      this.aiReviewSummary = '';
      return;
    }
    // Placeholder IA : ici tu brancheras ton appel Gemini plus tard
    this.aiReviewSummary =
      'Articles très appréciés par notre communauté (résumé IA à implémenter).';
  }

  goBack(): void {
    this.router.navigateByUrl('/shop');
  }

  toggleWishlist(): void {
    if (this.product) {
      this.wishlistService.toggle(this.product);
    }
  }

  isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
  }
}

