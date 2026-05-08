import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, ModalConfig } from '../../../core/services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit, OnDestroy {
  config: ModalConfig | null = null;
  private subscription?: Subscription;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.subscription = this.modalService.modal$.subscribe((config) => {
      this.config = config;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  confirm(): void {
    this.modalService.close(true);
  }

  cancel(): void {
    this.modalService.close(false);
  }

  getIconClass(): string {
    if (!this.config) return '';
    switch (this.config.type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  }

  getIcon(): string {
    if (!this.config) return '●';
    switch (this.config.type) {
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'success':
        return '✓';
      default:
        return 'ℹ';
    }
  }
}

