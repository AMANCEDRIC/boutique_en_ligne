import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../../../core/services/settings.service';
import { SECTIONS } from '../../../models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private settingsService = inject(SettingsService);
  settings$ = this.settingsService.settings$;
  sections = SECTIONS;
  year = new Date().getFullYear();

  get whatsappLink(): string {
    return this.settingsService.whatsappLink();
  }
}
