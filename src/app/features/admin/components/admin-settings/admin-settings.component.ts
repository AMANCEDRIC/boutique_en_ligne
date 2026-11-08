import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { SettingsService } from '../../../../core/services/settings.service';
import { ModalService } from '../../../../core/services/modal.service';
import { MediaUploaderComponent } from '../media-uploader/media-uploader.component';
import { ProductMedia, SECTIONS, ShopSettings } from '../../../../models';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MediaUploaderComponent],
  template: `
    <p *ngIf="!s" class="text-sm text-gray-400">Chargement des réglages…</p>
    <form *ngIf="s" (ngSubmit)="save()" class="space-y-6 max-w-4xl">
      <section class="bg-white border border-maison-light-gray p-5 sm:p-8 space-y-5">
        <h3 class="label-caps text-[10px]">Contact & réseaux</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label class="block space-y-2">
            <span class="label-caps text-[9px]">Numéro WhatsApp des commandes *</span>
            <input name="wa" [(ngModel)]="s.whatsappNumber" inputmode="tel" placeholder="Ex. 225 07 00 00 00 00"
              class="w-full border border-maison-light-gray px-3 py-3 text-sm focus:border-black outline-none" />
            <span class="block text-[11px] text-gray-500">Avec l’indicatif pays, sans le « + ». Ex. Côte d’Ivoire : 225…</span>
          </label>
          <label class="block space-y-2">
            <span class="label-caps text-[9px]">Téléphone affiché</span>
            <input name="phone" [(ngModel)]="s.phone" inputmode="tel" placeholder="+225 07 00 00 00 00"
              class="w-full border border-maison-light-gray px-3 py-3 text-sm focus:border-black outline-none" />
          </label>
          <label class="block space-y-2">
            <span class="label-caps text-[9px]">Lien TikTok</span>
            <input name="tiktok" [(ngModel)]="s.tiktok" type="url" placeholder="https://www.tiktok.com/@maisonshein"
              class="w-full border border-maison-light-gray px-3 py-3 text-sm focus:border-black outline-none" />
          </label>
          <label class="block space-y-2">
            <span class="label-caps text-[9px]">Lien Instagram</span>
            <input name="instagram" [(ngModel)]="s.instagram" type="url" placeholder="https://instagram.com/maisonshein"
              class="w-full border border-maison-light-gray px-3 py-3 text-sm focus:border-black outline-none" />
          </label>
          <label class="block space-y-2">
            <span class="label-caps text-[9px]">Lien Facebook</span>
            <input name="facebook" [(ngModel)]="s.facebook" type="url"
              class="w-full border border-maison-light-gray px-3 py-3 text-sm focus:border-black outline-none" />
          </label>
        </div>
      </section>

      <section class="bg-white border border-maison-light-gray p-5 sm:p-8 space-y-4">
        <h3 class="label-caps text-[10px]">Livraison</h3>
        <p class="text-xs text-gray-500">Affiché sur la page « Livraison » de la boutique.</p>
        <div class="space-y-3">
          <div *ngFor="let z of s.deliveryZones; let i = index" class="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_auto] gap-2 border-b border-maison-light-gray pb-3 sm:border-0 sm:pb-0">
            <input [name]="'zn' + i" [(ngModel)]="z.name" placeholder="Zone (ex. Cocody)"
              class="col-span-2 sm:col-span-1 border border-maison-light-gray px-3 py-2.5 text-sm focus:border-black outline-none" />
            <input [name]="'zp' + i" [(ngModel)]="z.price" placeholder="Tarif (ex. 1 500 FCFA)"
              class="border border-maison-light-gray px-3 py-2.5 text-sm focus:border-black outline-none" />
            <input [name]="'zd' + i" [(ngModel)]="z.delay" placeholder="Délai (ex. 24 h)"
              class="border border-maison-light-gray px-3 py-2.5 text-sm focus:border-black outline-none" />
            <button type="button" (click)="removeZone(i)" class="col-span-2 sm:col-span-1 text-xs text-red-600 border border-maison-light-gray px-3 py-2 hover:border-red-500">Retirer</button>
          </div>
          <button type="button" (click)="addZone()" class="border border-black px-5 py-2.5 text-xs font-semibold uppercase">+ Ajouter une zone</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          <label class="block space-y-2">
            <span class="label-caps text-[9px]">Délai habituel</span>
            <input name="ddelay" [(ngModel)]="s.deliveryDelay" placeholder="24 à 48 heures après validation"
              class="w-full border border-maison-light-gray px-3 py-3 text-sm focus:border-black outline-none" />
          </label>
          <label class="block space-y-2">
            <span class="label-caps text-[9px]">Remarque</span>
            <input name="dnote" [(ngModel)]="s.deliveryNote"
              class="w-full border border-maison-light-gray px-3 py-3 text-sm focus:border-black outline-none" />
          </label>
        </div>
      </section>

      <section class="bg-white border border-maison-light-gray p-5 sm:p-8 space-y-4">
        <h3 class="label-caps text-[10px]">Grand bandeau de l’accueil</h3>
        <p class="text-xs text-gray-500">Une photo ou une courte vidéo (format vertical conseillé pour le téléphone).</p>
        <div class="max-w-[200px]">
          <app-media-uploader [multiple]="false" [media]="heroList" (mediaChange)="setHero($event)" (busyChange)="busy = $event"
            addLabel="Photo ou vidéo"></app-media-uploader>
        </div>
      </section>

      <section class="bg-white border border-maison-light-gray p-5 sm:p-8 space-y-4">
        <h3 class="label-caps text-[10px]">Photos des rubriques</h3>
        <div class="grid grid-cols-3 gap-3 sm:gap-6">
          <div *ngFor="let sec of sections" class="space-y-2">
            <p class="text-xs font-semibold">{{ sec.id }}</p>
            <app-media-uploader [multiple]="false" accept="image/*" addLabel="Photo"
              [media]="sectionLists[sec.slug]" (mediaChange)="setSectionImage(sec.slug, $event)" (busyChange)="busy = $event"></app-media-uploader>
          </div>
        </div>
      </section>

      <section class="bg-white border border-maison-light-gray p-5 sm:p-8 space-y-4">
        <h3 class="label-caps text-[10px]">Bannières photo de l’accueil</h3>
        <p class="text-xs text-gray-500">Affichées entre les sections de l’accueil (lookbook, nouvel arrivage…).</p>
        <app-media-uploader accept="image/*" [media]="s.banners" (mediaChange)="s.banners = $event" (busyChange)="busy = $event"
          addLabel="Ajouter des photos"></app-media-uploader>
      </section>

      <section class="bg-white border border-maison-light-gray p-5 sm:p-8 space-y-4">
        <h3 class="label-caps text-[10px]">Photo de la page « À propos »</h3>
        <div class="max-w-[200px]">
          <app-media-uploader [multiple]="false" accept="image/*" addLabel="Photo"
            [media]="aboutList" (mediaChange)="setAbout($event)" (busyChange)="busy = $event"></app-media-uploader>
        </div>
      </section>

      <div class="sticky bottom-20 lg:bottom-4 z-20">
        <button type="submit" [disabled]="saving || busy"
          class="w-full sm:w-auto sm:px-16 bg-black text-white py-4 label-caps text-[10px] disabled:opacity-40 shadow-ambient">
          {{ saving ? 'Enregistrement…' : busy ? 'Envoi des médias…' : 'Enregistrer les réglages' }}
        </button>
      </div>
    </form>
  `,
})
export class AdminSettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private modal = inject(ModalService);

  sections = SECTIONS;
  s!: ShopSettings;
  saving = false;
  busy = false;

  // Listes stables passées aux uploaders (une nouvelle référence à chaque détection
  // de changement déclencherait ExpressionChangedAfterItHasBeenChecked).
  heroList: ProductMedia[] = [];
  aboutList: ProductMedia[] = [];
  sectionLists: Record<string, ProductMedia[]> = {};

  ngOnInit(): void {
    this.settingsService.loaded$.pipe(take(1)).subscribe((s) => {
      this.s = {
        ...s,
        banners: [...(s.banners ?? [])],
        sectionImages: { ...(s.sectionImages ?? {}) },
        deliveryZones: (s.deliveryZones ?? []).map((z) => ({ ...z })),
      };
      this.heroList = s.heroMedia ? [s.heroMedia] : [];
      this.aboutList = s.aboutImage ? [{ type: 'image', url: s.aboutImage }] : [];
      SECTIONS.forEach((sec) => {
        const url = this.s.sectionImages[sec.slug];
        this.sectionLists[sec.slug] = url ? [{ type: 'image', url }] : [];
      });
    });
  }

  addZone(): void {
    this.s.deliveryZones = [...this.s.deliveryZones, { name: '', price: '', delay: '' }];
  }

  removeZone(i: number): void {
    this.s.deliveryZones = this.s.deliveryZones.filter((_, idx) => idx !== i);
  }

  setHero(media: ProductMedia[]): void {
    this.heroList = media;
    this.s.heroMedia = media[0] ?? null;
  }

  setAbout(media: ProductMedia[]): void {
    this.aboutList = media;
    this.s.aboutImage = media[0]?.url ?? '';
  }

  setSectionImage(slug: string, media: ProductMedia[]): void {
    this.sectionLists[slug] = media;
    this.s.sectionImages = { ...this.s.sectionImages, [slug]: media[0]?.url ?? '' };
  }

  async save(): Promise<void> {
    if (!this.s.whatsappNumber.replace(/\D/g, '')) {
      this.modal.alert('Le numéro WhatsApp est obligatoire : c’est là que les commandes arrivent.', 'warning');
      return;
    }
    this.saving = true;
    try {
      // Firestore refuse `undefined` dans un merge explicite : on remplace par null/''.
      await this.settingsService.save({
        ...this.s,
        heroMedia: this.s.heroMedia ?? null,
        aboutImage: this.s.aboutImage ?? '',
        deliveryZones: this.s.deliveryZones.filter((z) => z.name.trim()),
      });
      this.modal.alert('Réglages enregistrés. Ils sont déjà visibles sur la boutique.', 'success');
    } catch (e) {
      this.modal.alert('Enregistrement impossible : ' + (e as Error).message, 'error');
    } finally {
      this.saving = false;
    }
  }
}
