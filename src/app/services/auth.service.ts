import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiService } from './api.service';
import { SessionService } from './session.service';
import { User } from '../models/interfaces';
import { normalizeIdentity } from '../core/utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);

  async login(identity: string, password: string): Promise<void> {
    const users = await firstValueFrom(this.api.getUsers());
    const identityNorm = normalizeIdentity(identity);
    const user = users.find(
      (item) => item.usernameNorm === identityNorm || item.emailNorm === identityNorm
    );

    if (!user || user.password !== password) {
      throw new Error('Usuario o contraseña incorrectos.');
    }

    this.session.setSession(user);
  }

  async register(payload: { username: string; email: string; password: string }): Promise<void> {
    const users = await firstValueFrom(this.api.getUsers());
    const usernameNorm = normalizeIdentity(payload.username);
    const emailNorm = normalizeIdentity(payload.email);

    if (users.some((item) => item.usernameNorm === usernameNorm)) {
      throw new Error('Ese usuario ya existe.');
    }

    if (users.some((item) => item.emailNorm === emailNorm)) {
      throw new Error('Ese correo ya está registrado.');
    }

    const user: User = {
      id: Date.now().toString(),
      username: payload.username.trim(),
      usernameNorm,
      email: payload.email.trim(),
      emailNorm,
      password: payload.password
    };

    await firstValueFrom(this.api.createUser(user));
  }

  async recover(email: string): Promise<void> {
    const users = await firstValueFrom(this.api.getUsers());
    const exists = users.some((item) => item.emailNorm === normalizeIdentity(email));

    if (!exists) {
      throw new Error('No encontramos ese correo.');
    }
  }
}
