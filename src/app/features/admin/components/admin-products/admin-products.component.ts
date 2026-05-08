import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, Category } from '../../../../models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent {
  @Input() products: Product[] = [];
  @Input() formatPriceFn!: (price: number) => string;
  @Output() addProduct = new EventEmitter<Partial<Product>>();
  @Output() deleteProduct = new EventEmitter<{ id: string; name: string }>();
  @Output() editProduct = new EventEmitter<Product>();

  // Stock maximum pour calculer le pourcentage (ajustez selon vos besoins)
  private readonly MAX_STOCK = 50;

  newProduct: Partial<Product> = {
    name: '',
    price: 0,
    category: 'Femme' as Category,
    description: '',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000' // Default placeholder
  };

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newProduct.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onAddProduct(): void {
    this.addProduct.emit(this.newProduct);
    this.newProduct = {
      name: '',
      price: 0,
      category: 'Femme' as Category,
      description: '',
      stock: 0,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000'
    };
  }

  onDeleteProduct(p: Product): void {
    this.deleteProduct.emit({ id: p.id, name: p.name });
  }

  onEditProduct(p: Product): void {
    this.editProduct.emit(p);
  }

  // Calculer le pourcentage de stock
  getStockPercentage(stock: number): number {
    return Math.min((stock / this.MAX_STOCK) * 100, 100);
  }

  // Obtenir la couleur de la barre selon le niveau de stock
  getStockColor(stock: number): string {
    const percentage = this.getStockPercentage(stock);
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  // Helper pour l'inventaire
  getTotalStockPieces(): number {
    return this.products.reduce((acc, p) => acc + (p.stock || 0), 0);
  }

  getLowStockCount(): number {
    return this.products.filter(p => (p.stock || 0) < 10).length;
  }
}

