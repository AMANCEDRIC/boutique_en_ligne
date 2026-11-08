import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { DEFAULT_SETTINGS, ShopSettings } from '../../models/settings.model';
import { isFirebaseConfigured } from '../../../environments/environment';
import { whatsappUrl } from '../utils/format';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private firestore = inject(Firestore);
  private subject = new BehaviorSubject<ShopSettings>(DEFAULT_SETTINGS);

  /** Réglages de la boutique (valeurs par défaut tant que Firestore n'a pas répondu). */
  readonly settings$: Observable<ShopSettings> = this.subject.asObservable();

  private loaded = false;

  /** Comme `settings$`, mais n'émet qu'une fois les vraies valeurs reçues de Firestore (pour l'édition). */
  readonly loaded$: Observable<ShopSettings> = this.settings$.pipe(filter(() => this.loaded));

  constructor() {
    if (!isFirebaseConfigured) return;
    (docData(doc(this.firestore, 'settings', 'shop')) as Observable<Partial<ShopSettings> | undefined>).subscribe({
      next: (s) => {
        this.loaded = true;
        this.subject.next({ ...DEFAULT_SETTINGS, ...(s ?? {}) });
      },
      error: (err) => console.error('Chargement des réglages impossible :', err),
    });
  }

  get snapshot(): ShopSettings {
    return this.subject.value;
  }

  whatsappLink(message?: string): string {
    return whatsappUrl(this.snapshot.whatsappNumber, message);
  }

  async save(patch: Partial<ShopSettings>): Promise<void> {
    await setDoc(doc(this.firestore, 'settings', 'shop'), patch, { merge: true });
  }
}
