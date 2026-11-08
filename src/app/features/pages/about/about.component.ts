import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { SettingsService } from '../../../core/services/settings.service';
import { cldUrl } from '../../../core/services/media.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pt-12 sm:pt-20 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <h1 class="font-script text-5xl md:text-6xl mb-4">Maison Shein</h1>
        <p class="label-caps tracking-[0.2em] text-gray-400">À propos de nous</p>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="aspect-[3/4] bg-maison-greige overflow-hidden">
          <img *ngIf="aboutImage$ | async as img; else noImg" [src]="img" alt="Maison Shein" class="w-full h-full object-cover" />
          <ng-template #noImg>
            <div class="w-full h-full flex items-center justify-center font-script text-4xl text-gray-300">Maison Shein</div>
          </ng-template>
        </div>
        
        <div class="space-y-6 text-gray-600 font-light leading-relaxed">
          <p>
            Bienvenue dans l'univers de <strong>Maison Shein</strong>, votre destination incontournable pour la mode féminine et les accessoires tendance.
          </p>
          <p>
            Fondée avec la passion d'habiller toutes les femmes avec élégance, Maison Shein propose des collections soigneusement sélectionnées allant des robes sublimes aux ensembles chics, en passant par nos accessoires et nos perruques, sans oublier notre rayon destockage et nouveautés.
          </p>
          <p>
            Notre engagement est simple : vous offrir des pièces de qualité, un style affirmé et un service client irréprochable. C'est pourquoi nous avons fait le choix d'un contact direct et humain via WhatsApp pour traiter chaque commande avec l'attention qu'elle mérite.
          </p>
          <p class="pt-6 font-serif italic text-xl text-black">
            "Révélez votre beauté à travers notre passion pour la mode."
          </p>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {
  aboutImage$ = inject(SettingsService).settings$.pipe(map((s) => (s.aboutImage ? cldUrl(s.aboutImage, 'w_900,f_auto,q_auto') : '')));
}
