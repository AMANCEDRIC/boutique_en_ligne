import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminStatsComponent } from './components/admin-stats/admin-stats.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { ProductsService } from '../../core/services/products.service';
import { OrdersService } from '../../core/services/orders.service';
import { ModalService } from '../../core/services/modal.service';
import { Product, Order } from '../../models';

type Tab = 'stats' | 'products' | 'orders';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminSidebarComponent,
    AdminStatsComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements OnInit {
  activeTab: Tab = 'stats';

  products: Product[] = [];
  orders: Order[] = [];

  constructor(
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    // S'abonner aux produits
    this.productsService.products$.subscribe((products) => {
      this.products = products;
    });

    // S'abonner aux commandes
    this.ordersService.orders$.subscribe((orders) => {
      this.orders = orders;
    });
  }

  setActiveTab(tab: Tab): void {
    this.activeTab = tab;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  get totalStock(): number {
    return this.productsService.getTotalStock();
  }

  addProduct(product: Partial<Product>): void {
    if (!product.name || !product.price || !product.category) {
      return;
    }
    this.productsService.addProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
    });
  }

  async deleteProduct(id: string, name: string): Promise<void> {
    const confirmed = await this.modalService.confirm(
      `⚠️ ATTENTION : Êtes-vous sûr de vouloir supprimer définitivement l'article "${name}" ? Cette action est irréversible.`,
      'Confirmer la suppression'
    );
    
    if (!confirmed) {
      return;
    }
    
    this.productsService.deleteProduct(id);
    this.modalService.alert('Produit supprimé avec succès.', 'success');
  }

  editProduct(product: Product): void {
    // Pour l'instant, afficher un message. Vous pouvez implémenter un modal d'édition plus tard
    this.modalService.alert(
      `Édition du produit "${product.name}" - Fonctionnalité à implémenter.`,
      'info'
    );
    // TODO: Implémenter un modal ou une page d'édition de produit
  }
}

