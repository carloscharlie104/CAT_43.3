import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Session, User } from '../models/interfaces';

const SESSION_KEY = 'cat43_session';

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

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.sessionSubject.next(session);
  }

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    this.sessionSubject.next(null);
  }

  private readSession(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }
}
