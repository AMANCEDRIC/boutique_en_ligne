import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, filter, from, map, switchMap } from 'rxjs';
import { ProductMedia } from '../../models/product.model';
import { environment, isCloudinaryConfigured } from '../../../environments/environment';

export interface UploadProgress {
  /** 0 → 100 */
  progress: number;
  /** Présent quand l'envoi est terminé. */
  media?: ProductMedia;
}

/** Limite de l'offre gratuite Cloudinary pour une vidéo envoyée en une fois. */
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const COMPRESS_ABOVE_BYTES = 1.5 * 1024 * 1024;
const MAX_IMAGE_SIDE = 2000;

/**
 * Ajoute une transformation Cloudinary à une URL (`/upload/` → `/upload/w_600,f_auto,q_auto/`).
 * Les URL non Cloudinary (photos de démo) sont renvoyées telles quelles.
 */
export function cldUrl(url: string | undefined, transform = 'f_auto,q_auto'): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/${transform}/`);
}

/** Image d'aperçu (1re image) d'une vidéo Cloudinary. */
export function videoPoster(url: string, width = 800): string {
  if (!url.includes('res.cloudinary.com')) return '';
  return cldUrl(url, `so_0,w_${width},f_jpg,q_auto`).replace(/\.[a-z0-9]+$/i, '.jpg');
}

@Injectable({ providedIn: 'root' })
export class MediaService {
  private http = inject(HttpClient);

  get isConfigured(): boolean {
    return isCloudinaryConfigured;
  }

  /** Envoie une photo ou une vidéo sur Cloudinary (preset non signé), avec la progression. */
  upload(file: File): Observable<UploadProgress> {
    const isVideo = file.type.startsWith('video/');
    if (!isCloudinaryConfigured) {
      throw new Error("Cloudinary n'est pas configuré (src/environments/environment.ts).");
    }
    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      throw new Error(`La vidéo « ${file.name} » dépasse 100 Mo. Raccourcissez-la ou réduisez sa qualité.`);
    }

    const { cloudName, uploadPreset } = environment.cloudinary;
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? 'video' : 'image'}/upload`;

    return from(isVideo ? Promise.resolve(file as Blob) : this.compressImage(file)).pipe(
      switchMap((blob) => {
        const body = new FormData();
        body.append('file', blob, file.name);
        body.append('upload_preset', uploadPreset);
        return this.http.post<{ secure_url: string; public_id: string }>(endpoint, body, {
          reportProgress: true,
          observe: 'events',
        });
      }),
      filter((e) => e.type === HttpEventType.UploadProgress || e.type === HttpEventType.Response),
      map((e): UploadProgress => {
        if (e.type === HttpEventType.Response) {
          return {
            progress: 100,
            media: { type: isVideo ? 'video' : 'image', url: e.body!.secure_url, publicId: e.body!.public_id },
          };
        }
        const total = (e as { total?: number }).total || file.size;
        return { progress: Math.min(99, Math.round(((e as { loaded: number }).loaded / total) * 100)) };
      })
    );
  }

  /**
   * Les photos de téléphone font souvent 4 à 10 Mo : on les réduit à 2000 px (JPEG 85 %)
   * avant l'envoi. Si le navigateur ne sait pas décoder le fichier (ex. HEIC sur Android),
   * on envoie l'original et Cloudinary s'en charge.
   */
  private async compressImage(file: File): Promise<Blob> {
    if (file.size < COMPRESS_ABOVE_BYTES || file.type === 'image/gif') return file;
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
      return blob && blob.size < file.size ? blob : file;
    } catch {
      return file;
    }
  }
}
