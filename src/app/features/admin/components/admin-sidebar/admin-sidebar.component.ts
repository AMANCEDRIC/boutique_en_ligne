import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type AdminTab = 'stats' | 'products' | 'categories' | 'orders' | 'settings';

export const ADMIN_TABS: { id: AdminTab; label: string; short: string; icon: string }[] = [
  { id: 'stats', label: 'Tableau de bord', short: 'Accueil', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { id: 'products', label: 'Articles', short: 'Articles', icon: 'M4 7l8-4 8 4v10l-8 4-8-4V7zm8 4l8-4M12 11L4 7m8 4v10' },
  { id: 'categories', label: 'Catégories', short: 'Catég.', icon: 'M4 6h16M4 12h16M4 18h10' },
  { id: 'orders', label: 'Commandes', short: 'Commandes', icon: 'M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2m7 18a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z' },
  { id: 'settings', label: 'Réglages & photos', short: 'Réglages', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.1-1.2l2-1.6-2-3.4-2.4 1a7.3 7.3 0 00-2-1.2L14.5 3h-5l-.4 2.6a7.3 7.3 0 00-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 000 2.4l-2 1.6 2 3.4 2.4-1a7.3 7.3 0 002 1.2l.4 2.6h5l.4-2.6a7.3 7.3 0 002-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z' },
];

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
})
export class AdminSidebarComponent {
  @Input() activeTab: AdminTab = 'stats';
  @Input() pendingOrders = 0;
  @Output() tabChange = new EventEmitter<AdminTab>();
  @Output() logout = new EventEmitter<void>();

  tabs = ADMIN_TABS;
}
