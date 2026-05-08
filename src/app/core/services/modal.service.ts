import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalConfig {
  title?: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalConfig | null>(null);
  private resultSubject = new BehaviorSubject<boolean | null>(null);
  
  modal$: Observable<ModalConfig | null> = this.modalSubject.asObservable();
  result$: Observable<boolean | null> = this.resultSubject.asObservable();

  show(config: ModalConfig): Promise<boolean> {
    this.modalSubject.next(config);
    this.resultSubject.next(null);
    
    return new Promise<boolean>((resolve) => {
      const subscription = this.result$.subscribe((result) => {
        if (result !== null) {
          subscription.unsubscribe();
          resolve(result);
        }
      });
    });
  }

  alert(message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info'): Promise<void> {
    return this.show({
      message,
      type,
      showCancel: false,
      confirmText: 'OK',
    }).then(() => {});
  }

  confirm(message: string, title?: string): Promise<boolean> {
    return this.show({
      title: title || 'Confirmation',
      message,
      type: 'warning',
      showCancel: true,
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
    });
  }

  close(result: boolean): void {
    this.modalSubject.next(null);
    this.resultSubject.next(result);
  }
}

