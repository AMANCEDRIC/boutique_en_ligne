import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Protège l'espace admin : redirige vers /admin/login si l'utilisateur n'est pas admin. */
export const adminGuard: CanActivateFn = async (_route, state) => {
  const router = inject(Router);
  const ok = await inject(AuthService).isAdmin();
  return ok ? true : router.createUrlTree(['/admin/login'], { queryParams: { redirect: state.url } });
};
