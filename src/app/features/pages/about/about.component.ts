import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-serif mb-4" style="font-family: 'Brush Script MT', 'Dancing Script', cursive;">Maison Shein</h1>
        <p class="label-caps tracking-[0.2em] text-gray-400">À propos de nous</p>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-400 font-serif">
          [Image de la boutique/créatrice]
        </div>
        
        <div class="space-y-6 text-gray-600 font-light leading-relaxed">
          <p>
            Bienvenue dans l'univers de <strong>Maison Shein</strong>, votre destination incontournable pour la mode féminine et les accessoires tendance.
          </p>
          <p>
            Fondée avec la passion d'habiller toutes les femmes avec élégance, Maison Shein propose des collections soigneusement sélectionnées allant des robes sublimes aux ensembles chics, sans oublier notre rayon destockage et nouveautés.
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
export class AboutComponent {}
