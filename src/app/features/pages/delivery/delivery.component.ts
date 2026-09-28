import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto">
      <h1 class="text-3xl font-serif text-center mb-12 uppercase tracking-widest">Informations de Livraison</h1>
      
      <div class="space-y-10">
        <section class="bg-gray-50 p-8">
          <h2 class="text-xl font-medium mb-4 flex items-center gap-3">
            <span class="text-2xl">📍</span> Zones desservies
          </h2>
          <p class="text-gray-600 font-light leading-relaxed mb-4">
            Nous livrons principalement dans notre région locale ainsi que dans les zones environnantes. Veuillez nous contacter via WhatsApp pour confirmer si votre quartier ou votre ville fait partie de notre zone de couverture.
          </p>
        </section>

        <section class="border border-gray-100 p-8">
          <h2 class="text-xl font-medium mb-4 flex items-center gap-3">
            <span class="text-2xl">💰</span> Tarifs de livraison
          </h2>
          <ul class="space-y-3 text-gray-600 font-light">
            <li class="flex justify-between border-b border-gray-100 pb-2">
              <span>Zone 1 (Centre)</span>
              <span class="font-medium text-black">À partir de X FCFA / €</span>
            </li>
            <li class="flex justify-between border-b border-gray-100 pb-2">
              <span>Zone 2 (Périphérie)</span>
              <span class="font-medium text-black">À partir de Y FCFA / €</span>
            </li>
            <li class="flex justify-between pb-2">
              <span>Livraison express</span>
              <span class="font-medium text-black">Sur demande</span>
            </li>
          </ul>
          <p class="text-xs text-gray-400 mt-4 italic">* Les prix exacts sont confirmés lors de la validation de la commande sur WhatsApp en fonction de votre adresse précise.</p>
        </section>

        <section class="bg-gray-50 p-8">
          <h2 class="text-xl font-medium mb-4 flex items-center gap-3">
            <span class="text-2xl">⏱️</span> Délais
          </h2>
          <p class="text-gray-600 font-light leading-relaxed">
            Les livraisons standards sont effectuées dans un délai de <strong>24 à 48 heures</strong> après validation de votre commande. En cas d'urgence, n'hésitez pas à nous le préciser sur WhatsApp pour une livraison express selon les disponibilités de nos livreurs.
          </p>
        </section>
      </div>
    </div>
  `
})
export class DeliveryComponent {}
