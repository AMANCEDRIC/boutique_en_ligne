import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../core/services/settings.service';

/** Zones, tarifs et délais : modifiables par l'admin (onglet Réglages > Livraison). */
@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="settings$ | async as s" class="min-h-screen pt-12 sm:pt-20 pb-20 px-4 md:px-8 max-w-3xl mx-auto">
      <h1 class="text-2xl sm:text-3xl font-serif text-center mb-10 sm:mb-12 uppercase tracking-widest">Livraison</h1>

      <div class="space-y-8">
        <section class="border border-maison-light-gray">
          <h2 class="label-caps text-[11px] px-5 sm:px-8 py-5 border-b border-maison-light-gray">Zones, tarifs & délais</h2>
          <div class="divide-y divide-maison-light-gray">
            <div *ngFor="let z of s.deliveryZones" class="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] gap-x-6 gap-y-1 px-5 sm:px-8 py-4">
              <span class="text-sm font-medium">{{ z.name }}</span>
              <span class="text-sm text-right font-semibold whitespace-nowrap">{{ z.price }}</span>
              <span class="text-xs text-gray-500 sm:text-sm sm:text-right sm:min-w-[90px] col-span-2 sm:col-span-1">{{ z.delay }}</span>
            </div>
            <p *ngIf="!s.deliveryZones.length" class="px-8 py-5 text-sm text-gray-500">Contactez-nous sur WhatsApp pour connaître les tarifs de votre zone.</p>
          </div>
          <p *ngIf="s.deliveryNote" class="text-xs text-gray-500 px-5 sm:px-8 py-4 bg-maison-greige italic">* {{ s.deliveryNote }}</p>
        </section>

        <section class="bg-maison-greige p-6 sm:p-8">
          <h2 class="label-caps text-[11px] mb-3">Délai habituel</h2>
          <p class="text-gray-600 font-light leading-relaxed">
            Livraison sous <strong class="text-black font-semibold">{{ s.deliveryDelay }}</strong>.
            Pour une livraison express, précisez-le sur WhatsApp : nous faisons notre possible selon la disponibilité des livreurs.
          </p>
        </section>

        <div class="text-center">
          <a [href]="whatsappLink" target="_blank" rel="noopener"
            class="inline-block bg-[#25D366] text-white px-8 py-4 label-caps text-[10px] hover:bg-[#128C7E]">
            Demander le tarif pour mon quartier
          </a>
        </div>
      </div>
    </div>
  `,
})
export class DeliveryComponent {
  private settings = inject(SettingsService);
  settings$ = this.settings.settings$;

  get whatsappLink(): string {
    return this.settings.whatsappLink('Bonjour Maison Shein, quel est le tarif de livraison pour mon quartier : ');
  }
}
