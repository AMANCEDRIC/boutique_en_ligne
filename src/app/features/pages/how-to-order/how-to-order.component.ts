import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-how-to-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
      <h1 class="text-3xl font-serif text-center mb-12 uppercase tracking-widest">Comment commander ?</h1>
      
      <div class="space-y-12">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div class="w-16 h-16 bg-black text-white flex-shrink-0 flex items-center justify-center rounded-full text-2xl font-serif">1</div>
          <div>
            <h2 class="text-xl font-medium mb-3">Faites votre sélection</h2>
            <p class="text-gray-600 font-light leading-relaxed">
              Parcourez nos catégories de vêtements et accessoires. Cliquez sur les articles qui vous plaisent pour voir les détails (photos, prix, tailles disponibles). Ajoutez vos articles préférés dans votre panier en cliquant sur le bouton "Ajouter au panier".
            </p>
          </div>
        </div>

        <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div class="w-16 h-16 bg-black text-white flex-shrink-0 flex items-center justify-center rounded-full text-2xl font-serif">2</div>
          <div>
            <h2 class="text-xl font-medium mb-3">Vérifiez votre panier</h2>
            <p class="text-gray-600 font-light leading-relaxed">
              Une fois votre sélection terminée, accédez à votre panier. Vous y trouverez le récapitulatif de vos articles et le montant total. Renseignez soigneusement vos informations personnelles (Nom, Adresse, Numéro de téléphone) pour la livraison.
            </p>
          </div>
        </div>

        <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div class="w-16 h-16 bg-[#25D366] text-white flex-shrink-0 flex items-center justify-center rounded-full text-2xl font-serif">3</div>
          <div>
            <h2 class="text-xl font-medium mb-3">Validez via WhatsApp</h2>
            <p class="text-gray-600 font-light leading-relaxed">
              Cliquez sur "Valider ma commande sur WhatsApp". Vous serez automatiquement redirigé(e) vers notre numéro WhatsApp avec un message pré-rempli contenant le détail de votre commande. Envoyez le message pour que notre équipe valide votre commande avec vous instantanément.
            </p>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-16">
        <a routerLink="/shop" class="bg-black text-white px-8 py-3 label-caps tracking-widest hover:bg-gray-800 transition-colors inline-block">Commencer mon shopping</a>
      </div>
    </div>
  `
})
export class HowToOrderComponent {}
