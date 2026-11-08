import { Injectable, inject } from '@angular/core';
import { Auth, User, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, firstValueFrom, of } from 'rxjs';
import { isFirebaseConfigured } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  readonly user$: Observable<User | null> = isFirebaseConfigured ? authState(this.auth) : of(null);

  /**
   * Un compte Firebase Auth ne suffit pas : l'UID doit aussi figurer dans `admins/{uid}`.
   * (L'inscription par l'API publique reste possible ; les règles Firestore font la même vérification.)
   */
  async isAdmin(): Promise<boolean> {
    if (!isFirebaseConfigured) return false;
    const user = await firstValueFrom(this.user$);
    if (!user) return false;
    try {
      const snap = await getDoc(doc(this.firestore, 'admins', user.uid));
      return snap.exists();
    } catch {
      return false;
    }
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email.trim(), password);
    if (!(await this.isAdmin())) {
      const uid = this.auth.currentUser?.uid;
      await signOut(this.auth);
      throw new Error(
        `Ce compte n'a pas les droits d'administration. Ajoutez le document admins/${uid} dans Firestore.`
      );
    }
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}
