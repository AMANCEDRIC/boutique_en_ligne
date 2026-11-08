import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService, cldUrl, videoPoster } from '../../../../core/services/media.service';
import { ProductMedia } from '../../../../models';

interface PendingUpload {
  name: string;
  progress: number;
  error?: string;
}

/**
 * Sélection + envoi Cloudinary de photos/vidéos, avec réordonnancement.
 * Le 1er élément de type image est la couverture de l'article.
 */
@Component({
  selector: 'app-media-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3">
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <div *ngFor="let m of media; let i = index; let first = first; let last = last"
          class="relative aspect-[3/4] bg-maison-greige overflow-hidden border"
          [ngClass]="i === coverIndex ? 'border-black' : 'border-maison-light-gray'">
          <img *ngIf="m.type === 'image'" [src]="thumb(m.url)" class="w-full h-full object-cover" alt="" />
          <ng-container *ngIf="m.type === 'video'">
            <img *ngIf="poster(m.url)" [src]="poster(m.url)" class="w-full h-full object-cover" alt="" />
            <span class="absolute inset-0 flex items-center justify-center">
              <span class="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center text-xs">▶</span>
            </span>
          </ng-container>

          <span *ngIf="i === coverIndex" class="absolute top-0 left-0 bg-black text-white text-[8px] font-bold uppercase px-1.5 py-0.5">Couverture</span>

          <div class="absolute bottom-0 inset-x-0 flex bg-white/90 text-[11px]">
            <button type="button" (click)="move(i, -1)" [disabled]="first" class="flex-1 py-2 disabled:opacity-20" aria-label="Déplacer à gauche">◀</button>
            <button *ngIf="multiple && m.type === 'image' && i !== coverIndex" type="button" (click)="makeCover(i)" class="flex-1 py-2" aria-label="Mettre en couverture">★</button>
            <button type="button" (click)="remove(i)" class="flex-1 py-2 text-red-600" aria-label="Supprimer">✕</button>
            <button type="button" (click)="move(i, 1)" [disabled]="last" class="flex-1 py-2 disabled:opacity-20" aria-label="Déplacer à droite">▶</button>
          </div>
        </div>

        <label *ngIf="multiple || !media.length"
          class="aspect-[3/4] border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-black text-gray-500 hover:text-black">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1.4" d="M12 5v14M5 12h14"/></svg>
          <span class="text-[9px] font-semibold uppercase tracking-wide text-center px-2">{{ addLabel }}</span>
          <input type="file" class="hidden" [accept]="accept" [multiple]="multiple" (change)="onFiles($event)" />
        </label>
      </div>

      <div *ngFor="let u of uploads" class="text-xs space-y-1">
        <div class="flex justify-between gap-3">
          <span class="truncate">{{ u.name }}</span>
          <span [class.text-red-600]="u.error">{{ u.error ? 'Échec' : u.progress + ' %' }}</span>
        </div>
        <div *ngIf="!u.error" class="h-1 bg-maison-light-gray"><div class="h-full bg-black" [style.width.%]="u.progress"></div></div>
        <p *ngIf="u.error" class="text-red-600 leading-snug">{{ u.error }}</p>
      </div>

      <p *ngIf="!mediaService.isConfigured" class="text-xs text-orange-700">
        Cloudinary n'est pas configuré : l'envoi de photos est désactivé (voir FIREBASE_SETUP.md).
      </p>
    </div>
  `,
})
export class MediaUploaderComponent {
  mediaService = inject(MediaService);

  @Input() media: ProductMedia[] = [];
  @Input() multiple = true;
  @Input() accept = 'image/*,video/*';
  @Input() addLabel = 'Ajouter photos / vidéos';
  @Output() mediaChange = new EventEmitter<ProductMedia[]>();
  /** true tant qu'au moins un envoi est en cours. */
  @Output() busyChange = new EventEmitter<boolean>();

  uploads: PendingUpload[] = [];

  get coverIndex(): number {
    return this.media.findIndex((m) => m.type === 'image');
  }

  thumb(url: string): string {
    return cldUrl(url, 'w_300,f_auto,q_auto');
  }

  poster(url: string): string {
    return videoPoster(url, 300);
  }

  onFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    files.forEach((f) => this.uploadOne(f));
  }

  private uploadOne(file: File): void {
    const entry: PendingUpload = { name: file.name, progress: 0 };
    this.uploads = [...this.uploads, entry];
    this.emitBusy();
    try {
      this.mediaService.upload(file).subscribe({
        next: (p) => {
          entry.progress = p.progress;
          if (p.media) {
            this.update(this.multiple ? [...this.media, p.media] : [p.media]);
            this.uploads = this.uploads.filter((u) => u !== entry);
            this.emitBusy();
          }
        },
        error: (err) => this.fail(entry, err?.error?.error?.message || err?.message || 'Envoi impossible.'),
      });
    } catch (err) {
      this.fail(entry, (err as Error).message);
    }
  }

  private fail(entry: PendingUpload, message: string): void {
    entry.error = message;
    this.emitBusy();
    setTimeout(() => {
      this.uploads = this.uploads.filter((u) => u !== entry);
    }, 8000);
  }

  private emitBusy(): void {
    this.busyChange.emit(this.uploads.some((u) => !u.error));
  }

  move(i: number, delta: number): void {
    const list = [...this.media];
    const j = i + delta;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    this.update(list);
  }

  makeCover(i: number): void {
    const list = [...this.media];
    const [item] = list.splice(i, 1);
    this.update([item, ...list]);
  }

  remove(i: number): void {
    this.update(this.media.filter((_, idx) => idx !== i));
  }

  private update(list: ProductMedia[]): void {
    this.media = list;
    this.mediaChange.emit(list);
  }
}
