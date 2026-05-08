import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type Tab = 'stats' | 'products' | 'orders';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent {
  @Input() activeTab: Tab = 'stats';
  @Output() tabChange = new EventEmitter<Tab>();

  setTab(tab: Tab): void {
    this.tabChange.emit(tab);
  }
}

