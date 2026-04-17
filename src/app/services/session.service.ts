import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Session, User } from '../models/interfaces';

// Provisional client-side session storage until Firebase Auth is integrated.
const SESSION_KEY = 'cat43_session_temp';
const LEGACY_SESSION_KEY = 'cat43_session';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly sessionSubject = new BehaviorSubject<Session | null>(this.readSession());
  readonly session$ = this.sessionSubject.asObservable();

  get snapshot(): Session | null {
    return this.sessionSubject.value;
  }

  setSession(user: User): void {
    const session: Session = {
      username: user.username,
      email: user.email,
      loginAt: new Date().toISOString()
    };

    this.writeSession(session);
    this.sessionSubject.next(session);
  }

  clearSession(): void {
    this.removeSession();
    this.sessionSubject.next(null);
  }

  private readSession(): Session | null {
    try {
      if (typeof localStorage === 'undefined') {
        return null;
      }
      const currentRaw = localStorage.getItem(SESSION_KEY);
      if (currentRaw) {
        return JSON.parse(currentRaw) as Session;
      }

      const legacyRaw = localStorage.getItem(LEGACY_SESSION_KEY);
      if (!legacyRaw) {
        return null;
      }

      const legacySession = JSON.parse(legacyRaw) as Session;
      this.writeSession(legacySession);
      localStorage.removeItem(LEGACY_SESSION_KEY);
      return legacySession;
    } catch {
      return null;
    }
  }

  private writeSession(session: Session): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
    } catch {
      // Ignore local storage errors in provisional mode.
    }
  }

  private removeSession(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // Ignore local storage errors in provisional mode.
    }
  }
}
