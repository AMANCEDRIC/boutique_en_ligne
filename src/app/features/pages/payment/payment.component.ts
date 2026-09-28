import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto">
      <h1 class="text-3xl font-serif text-center mb-12 uppercase tracking-widest">Moyens de paiement</h1>
      
      <p class="text-center text-gray-600 font-light mb-12">
        Afin de vous offrir une flexibilité maximale et une sécurité totale, la validation finale de toutes vos commandes se fait directement avec notre équipe via WhatsApp. Voici les modes de règlement que nous acceptons.
      </p>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow">
          <div class="text-4xl mb-4">💵</div>
          <h2 class="text-xl font-medium mb-3">Paiement à la livraison</h2>
          <p class="text-gray-500 font-light text-sm">
            Réglez vos achats en espèces directement auprès du livreur au moment de la réception de votre commande.
          </p>
        </div>

        <div class="border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow">
          <div class="text-4xl mb-4">📱</div>
          <h2 class="text-xl font-medium mb-3">Mobile Money</h2>
          <p class="text-gray-500 font-light text-sm">
            Effectuez votre paiement via Mobile Money (Wave, Orange Money, MTN, etc.) avant ou au moment de la livraison.
          </p>
        </div>
      </div>

      <div class="mt-16 bg-black text-white p-8 text-center">
        <h3 class="font-serif text-2xl mb-4">Une question sur le paiement ?</h3>
        <p class="font-light text-white/80 mb-6 text-sm">Notre service client est à votre disposition pour toute précision lors de la validation WhatsApp.</p>
        <a href="https://wa.me/33600000000" target="_blank" class="inline-block bg-white text-black px-6 py-2 label-caps text-[10px] hover:bg-gray-200 transition-colors">
          Nous contacter
        </a>
      </div>
    </div>
  `
})
export class PaymentComponent {}
