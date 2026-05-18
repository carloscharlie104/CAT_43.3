import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../core/firebase';
import { Session } from '../models/interfaces';
import { FavoritesService } from './favorites.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly sessionSubject = new BehaviorSubject<Session | null>(null);
  private readonly favoritesService = inject(FavoritesService);

  readonly session$ = this.sessionSubject.asObservable();

  get snapshot(): Session | null {
    return this.sessionSubject.value;
  }

  constructor() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser || !firebaseUser.email) {
        this.sessionSubject.next(null);
        void this.favoritesService.setUser(null);
        return;
      }

      const profile = await this.getUserProfile(firebaseUser.uid);

      const session: Session = {
        uid: firebaseUser.uid,
        username: profile?.username ?? firebaseUser.displayName ?? firebaseUser.email,
        email: firebaseUser.email,
        role: profile?.role ?? 'user',
        loginAt: new Date().toISOString()
      };

      this.sessionSubject.next(session);
      void this.favoritesService.setUser(session.uid);
    });
  }

  setSession(session: Session): void {
    this.sessionSubject.next(session);
    void this.favoritesService.setUser(session.uid);
  }

  clearSession(): void {
    this.sessionSubject.next(null);
    void this.favoritesService.setUser(null);
  }

  private async getUserProfile(uid: string): Promise<{ username?: string; role?: 'user' | 'admin' } | null> {
    try {
      const profileDoc = await getDoc(doc(db, 'users', uid));

      if (!profileDoc.exists()) {
        return null;
      }

      return profileDoc.data() as { username?: string; role?: 'user' | 'admin' };
    } catch {
      return null;
    }
  }
}
