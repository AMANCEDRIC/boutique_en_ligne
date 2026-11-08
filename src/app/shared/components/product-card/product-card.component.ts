import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product, hasVideo } from '../../../models/product.model';
import { cldUrl } from '../../../core/services/media.service';
import { formatPrice } from '../../../core/utils/format';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() compact = false;
  @Input() showBadges = true;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<Product>();
  
  addedToCart = false;
  hasVideo = hasVideo;

  get imageUrl(): string {
    return cldUrl(this.product.image, this.compact ? 'w_400,f_auto,q_auto' : 'w_600,f_auto,q_auto');
  }

  formatPrice(price: number): string {
    return formatPrice(price);
  }

  onAddToCart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
    
    // Feedback animation
    this.addedToCart = true;
    setTimeout(() => this.addedToCart = false, 1500);
  }

  onToggleWishlist(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleWishlist.emit(this.product);
  }
}


