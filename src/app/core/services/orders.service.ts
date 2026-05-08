import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../../models/order.model';
import { MOCK_ORDERS } from '../../constants/mock-orders';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'orders';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private ordersSubject: BehaviorSubject<Order[]>;
  public orders$: Observable<Order[]>;

  constructor(private storageService: StorageService) {
    const initialOrders = this.loadInitialOrders();
    this.ordersSubject = new BehaviorSubject<Order[]>(initialOrders);
    this.orders$ = this.ordersSubject.asObservable();
  }

  private loadInitialOrders(): Order[] {
    const stored = this.storageService.getItem<Order[]>(STORAGE_KEY);
    if (stored && stored.length > 0) {
      return stored;
    }
    // Si pas de données stockées, utiliser les mock orders
    this.storageService.setItem(STORAGE_KEY, MOCK_ORDERS);
    return MOCK_ORDERS;
  }

  private save(orders: Order[]): void {
    this.storageService.setItem(STORAGE_KEY, orders);
    this.ordersSubject.next(orders);
  }

  getAll(): Order[] {
    return this.ordersSubject.value;
  }

  getOrders(): Order[] {
    return this.getAll();
  }

  getById(id: string): Order | null {
    return this.getAll().find((o) => o.id === id) || null;
  }

  addOrder(order: Order): void {
    const updated = [...this.getAll(), order];
    this.save(updated);
  }

  generateOrderId(): string {
    const orders = this.getAll();
    const nextNumber = orders.length + 1;
    return `ORD-${String(nextNumber).padStart(3, '0')}`;
  }

  updateOrderStatus(orderId: string, newStatus: Order['status']): void {
    const current = this.getAll();
    this.save(
      current.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }
}

