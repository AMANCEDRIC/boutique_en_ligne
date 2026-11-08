import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ModalService } from '../../../../core/services/modal.service';
import { Category, MainCategory, Product, SECTIONS } from '../../../../models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <p class="text-sm text-gray-500 max-w-2xl">
        Les rubriques (Vêtements, Accessoires, Perruques) sont fixes. Ajoutez-y autant de catégories que nécessaire :
        elles apparaissent automatiquement dans le menu et les filtres de la boutique.
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div *ngFor="let s of sections" class="bg-white border border-maison-light-gray">
          <h3 class="label-caps text-[10px] px-4 sm:px-5 py-4 border-b border-maison-light-gray">{{ s.id }}</h3>

          <div class="divide-y divide-maison-light-gray">
            <div *ngFor="let c of bySection(s.id)" class="flex items-center gap-2 px-4 sm:px-5 py-2.5">
              <ng-container *ngIf="renaming?.id !== c.id; else renameTpl">
                <span class="flex-1 text-sm">{{ c.name }}</span>
                <span class="text-[10px] text-gray-400 mr-1">{{ count(c) }} art.</span>
                <button (click)="startRename(c)" class="p-2 text-gray-400 hover:text-black" aria-label="Renommer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1.4" d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4"/></svg>
                </button>
                <button (click)="remove(c)" class="p-2 text-gray-400 hover:text-red-600" aria-label="Supprimer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1.4" d="M5 7h14M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>
                </button>
              </ng-container>
              <ng-template #renameTpl>
                <input [(ngModel)]="renameValue" (keydown.enter)="confirmRename()" (keydown.escape)="renaming = null"
                  class="flex-1 border border-black px-2 py-1.5 text-sm outline-none" />
                <button (click)="confirmRename()" class="px-3 py-1.5 bg-black text-white text-xs">OK</button>
              </ng-template>
            </div>
            <p *ngIf="!bySection(s.id).length" class="px-5 py-4 text-xs text-gray-400">Aucune catégorie.</p>
          </div>

          <form (ngSubmit)="add(s.id)" class="flex gap-2 p-4 sm:p-5 border-t border-maison-light-gray">
            <input [name]="'new-' + s.slug" [(ngModel)]="newNames[s.id]" placeholder="Nouvelle catégorie"
              class="flex-1 min-w-0 border border-maison-light-gray px-3 py-2.5 text-sm focus:border-black outline-none" />
            <button type="submit" class="bg-black text-white px-4 text-xs font-semibold uppercase">Ajouter</button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class AdminCategoriesComponent {
  private categoriesService = inject(CategoriesService);
  private modal = inject(ModalService);

  @Input() products: Product[] = [];

  sections = SECTIONS;
  categories: Category[] = [];
  newNames: Record<string, string> = {};
  renaming: Category | null = null;
  renameValue = '';

  constructor() {
    this.categoriesService.categories$.pipe(takeUntilDestroyed()).subscribe((list) => (this.categories = list));
  }

  bySection(section: MainCategory): Category[] {
    return this.categories.filter((c) => c.section === section);
  }

  count(c: Category): number {
    return this.products.filter((p) => p.categoryId === c.id).length;
  }

  async add(section: MainCategory): Promise<void> {
    const name = (this.newNames[section] || '').trim();
    if (!name) return;
    try {
      await this.categoriesService.add(name, section);
      this.newNames[section] = '';
    } catch (e) {
      this.modal.alert((e as Error).message, 'warning');
    }
  }

  startRename(c: Category): void {
    this.renaming = c;
    this.renameValue = c.name;
  }

  async confirmRename(): Promise<void> {
    const c = this.renaming;
    if (!c) return;
    this.renaming = null;
    try {
      await this.categoriesService.rename(c, this.renameValue);
    } catch (e) {
      this.modal.alert('Renommage impossible : ' + (e as Error).message, 'error');
    }
  }

  async remove(c: Category): Promise<void> {
    const ok = await this.modal.confirm(`Supprimer la catégorie « ${c.name} » ?`, 'Supprimer la catégorie');
    if (!ok) return;
    try {
      await this.categoriesService.remove(c);
    } catch (e) {
      this.modal.alert((e as Error).message, 'warning');
    }
  }
}
