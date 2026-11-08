import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../../core/services/products.service';
import { ModalService } from '../../../../core/services/modal.service';
import { cldUrl } from '../../../../core/services/media.service';
import { formatPrice } from '../../../../core/utils/format';
import { MainCategory, Product, SECTIONS, hasVideo } from '../../../../models';
import { AdminProductFormComponent } from '../admin-product-form/admin-product-form.component';
import { isFirebaseConfigured } from '../../../../../environments/environment';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminProductFormComponent],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent {
  private productsService = inject(ProductsService);
  private modal = inject(ModalService);

  @Input() products: Product[] = [];

  sections = SECTIONS;
  formatPrice = formatPrice;
  hasVideo = hasVideo;

  search = '';
  sectionFilter: MainCategory | 'all' = 'all';

  /** undefined = formulaire fermé ; null = nouvel article ; Product = modification. */
  editing: Product | null | undefined = undefined;
  importing = false;

  get filtered(): Product[] {
    const q = this.search.trim().toLowerCase();
    return this.products.filter(
      (p) =>
        (this.sectionFilter === 'all' || p.mainCategory === this.sectionFilter) &&
        (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
  }

  thumb(p: Product): string {
    return cldUrl(p.image, 'w_200,f_auto,q_auto');
  }

  copiedId = '';

  /** Copie le lien de l'article (à coller en légende TikTok / statut WhatsApp). */
  async copyLink(p: Product): Promise<void> {
    const url = `${window.location.origin}/product/${p.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copiez le lien de l’article :', url);
      return;
    }
    this.copiedId = p.id;
    setTimeout(() => (this.copiedId = this.copiedId === p.id ? '' : this.copiedId), 2000);
  }

  openNew(): void {
    this.editing = null;
  }

  openEdit(p: Product): void {
    this.editing = p;
  }

  onFormClosed(saved: boolean): void {
    const wasEdit = !!this.editing;
    this.editing = undefined;
    if (saved) this.modal.alert(wasEdit ? 'Article mis à jour.' : 'Article publié sur la boutique.', 'success');
  }

  async remove(p: Product): Promise<void> {
    const ok = await this.modal.confirm(
      `Supprimer définitivement « ${p.name} » ? Il disparaîtra immédiatement de la boutique.`,
      'Supprimer l’article'
    );
    if (!ok) return;
    try {
      await this.productsService.deleteProduct(p.id);
    } catch (e) {
      this.modal.alert('Suppression impossible : ' + (e as Error).message, 'error');
    }
  }

  async adjustStock(p: Product, delta: number): Promise<void> {
    try {
      await this.productsService.setStock(p.id, (p.stock || 0) + delta);
    } catch (e) {
      this.modal.alert('Mise à jour impossible : ' + (e as Error).message, 'error');
    }
  }

  async importDemo(): Promise<void> {
    if (!isFirebaseConfigured) return;
    const ok = await this.modal.confirm(
      'Ajouter les 10 articles de démonstration à la boutique ? Vous pourrez les modifier ou les supprimer ensuite.',
      'Articles de démonstration'
    );
    if (!ok) return;
    this.importing = true;
    try {
      await this.productsService.importDemoProducts();
    } catch (e) {
      this.modal.alert('Import impossible : ' + (e as Error).message, 'error');
    } finally {
      this.importing = false;
    }
  }
}
