import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../models';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-stats.component.html',
  styleUrl: './admin-stats.component.scss',
})
export class AdminStatsComponent {
  @Input() products: Product[] = [];
  @Input() totalStock = 0;
  @Input() formatPriceFn!: (price: number) => string;
}

