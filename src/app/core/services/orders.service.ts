import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  orderBy,
  query,
  writeBatch,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Order, OrderStatus } from '../../models/order.model';
import { formatPrice } from '../utils/format';
import { ProductsService } from './products.service';

const LAST_ORDER_KEY = 'maison_shein_last_order';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private firestore = inject(Firestore);
  private productsService = inject(ProductsService);

  /** Référence courte et non séquentielle, ex. MS-K3F9Q. */
  generateRef(): string {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let ref = '';
    for (let i = 0; i < 5; i++) ref += alphabet[Math.floor(Math.random() * alphabet.length)];
    return `MS-${ref}`;
  }

  /** Création publique (autorisée par les règles). Retourne l'id du document. */
  async addOrder(order: Omit<Order, 'id'>): Promise<string> {
    const ref = await addDoc(collection(this.firestore, 'orders'), order);
    return ref.id;
  }

  /** Admin uniquement : toutes les commandes en temps réel. */
  watchAll(): Observable<Order[]> {
    const q = query(collection(this.firestore, 'orders'), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  /** Admin uniquement. */
  watchById(id: string): Observable<Order | null> {
    return (docData(doc(this.firestore, 'orders', id), { idField: 'id' }) as Observable<Order | undefined>).pipe(
      map((o) => o ?? null)
    );
  }

  /**
   * Change le statut et tient le stock à jour :
   * - passage en Expédié/Livré → stock décompté une seule fois (`stockDeducted`) ;
   * - passage en Annulé après décompte → stock restitué.
   */
  async updateOrderStatus(order: Order, status: OrderStatus): Promise<void> {
    const batch = writeBatch(this.firestore);
    const shipped = status === 'Expédié' || status === 'Livré';
    let stockDeducted = !!order.stockDeducted;
    let direction = 0;
    if (shipped && !stockDeducted) {
      direction = -1;
      stockDeducted = true;
    } else if (status === 'Annulé' && stockDeducted) {
      direction = 1;
      stockDeducted = false;
    }

    if (direction) {
      const products = this.productsService.getAll();
      const qtyById = new Map<string, number>();
      order.items.forEach((i) => qtyById.set(i.id, (qtyById.get(i.id) ?? 0) + i.quantity));
      qtyById.forEach((qty, productId) => {
        const p = products.find((x) => x.id === productId);
        if (!p) return; // article supprimé depuis
        batch.update(doc(this.firestore, 'products', productId), {
          stock: Math.max(0, (p.stock || 0) + direction * qty),
        });
      });
    }

    batch.update(doc(this.firestore, 'orders', order.id), { status, stockDeducted });
    await batch.commit();
  }

  /** Message WhatsApp pré-rempli envoyé par la cliente à la boutique. */
  whatsappMessage(o: Omit<Order, 'id'>): string {
    let m = `Bonjour Maison Shein, je souhaite valider ma commande (Réf : ${o.ref}) :\n\n`;
    o.items.forEach((i) => {
      m += `- ${i.quantity}x ${i.name} (${i.selectedSize}) - ${formatPrice(i.price * i.quantity)}\n`;
    });
    m += `\n*TOTAL : ${formatPrice(o.total)}* (hors livraison)\n\n`;
    m += `*Mes coordonnées :*\n`;
    m += `Nom : ${o.customerName}\n`;
    m += `Téléphone : ${o.customerPhone}\n`;
    if (o.customerWhatsapp && o.customerWhatsapp !== o.customerPhone) m += `WhatsApp : ${o.customerWhatsapp}\n`;
    m += `Adresse : ${o.customerDistrict ? o.customerDistrict + ', ' : ''}${o.customerAddress}\n`;
    m += `Paiement souhaité : ${o.paymentMethod}\n`;
    if (o.notes) m += `Notes : ${o.notes}\n`;
    return m;
  }

  /** La cliente ne peut pas relire `orders` : on garde sa dernière commande en local. */
  rememberLastOrder(order: Omit<Order, 'id'>): void {
    try {
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    } catch {
      /* stockage indisponible : la page de confirmation affichera un message générique */
    }
  }

  getLastOrder(): Omit<Order, 'id'> | null {
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
