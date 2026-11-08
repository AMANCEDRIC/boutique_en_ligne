import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { isFirebaseConfigured } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-maison-greige flex items-center justify-center px-5 py-12">
      <div class="w-full max-w-sm bg-white p-8 sm:p-10 border border-maison-light-gray">
        <a routerLink="/" class="block text-center font-script text-5xl leading-none">Maison Shein</a>
        <p class="label-caps text-[9px] text-gray-400 text-center mt-2 mb-10 tracking-[0.3em]">Espace administration</p>

        <div *ngIf="!configured" class="border border-maison-gold/50 bg-maison-gold/5 p-4 text-xs leading-relaxed mb-6">
          Firebase n'est pas encore configuré. Renseignez <code>src/environments/environment.ts</code>
          (voir le guide <code>FIREBASE_SETUP.md</code>).
        </div>

        <form (ngSubmit)="submit()" class="space-y-6">
          <label class="block space-y-2">
            <span class="label-caps text-[9px]">E-mail</span>
            <input type="email" name="email" [(ngModel)]="email" autocomplete="username" required
              class="w-full border border-maison-light-gray px-3 py-3 text-sm focus:border-black outline-none" />
          </label>
          <label class="block space-y-2">
            <span class="label-caps text-[9px]">Mot de passe</span>
            <input type="password" name="password" [(ngModel)]="password" autocomplete="current-password" required
              class="w-full border border-maison-light-gray px-3 py-3 text-sm focus:border-black outline-none" />
          </label>

          <p *ngIf="error" class="text-xs text-red-600 leading-relaxed">{{ error }}</p>

          <button type="submit" [disabled]="loading || !configured"
            class="w-full bg-black text-white py-4 label-caps text-[10px] hover:bg-black/90 disabled:opacity-40">
            {{ loading ? 'Connexion…' : 'Se connecter' }}
          </button>
        </form>

        <a routerLink="/" class="block text-center label-caps text-[9px] text-gray-400 hover:text-black mt-8">← Retour à la boutique</a>
      </div>
    </div>
  `,
})
export class AdminLoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  configured = isFirebaseConfigured;
  email = '';
  password = '';
  loading = false;
  error = '';

  async submit(): Promise<void> {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.error = '';
    try {
      await this.auth.login(this.email, this.password);
      const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/admin';
      await this.router.navigateByUrl(redirect);
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? '';
      this.error =
        code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found'
          ? 'E-mail ou mot de passe incorrect.'
          : code === 'auth/too-many-requests'
            ? 'Trop de tentatives. Réessayez dans quelques minutes.'
            : (e as Error).message || 'Connexion impossible.';
    } finally {
      this.loading = false;
    }
  }
}
