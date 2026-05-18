import { Injectable, inject } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '../core/firebase';
import { normalizeIdentity } from '../core/utils';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly session = inject(SessionService);

  async login(identity: string, password: string): Promise<void> {
    const email = identity.trim();

    if (!email || !password) {
      throw new Error('Introduce el correo y la contraseña.');
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);

      this.session.setSession({
        uid: credential.user.uid,
        username: credential.user.displayName ?? credential.user.email ?? email,
        email: credential.user.email ?? email,
        role: 'user',
        loginAt: new Date().toISOString()
      });
    } catch (error) {
      throw new Error(this.mapAuthError(error));
    }
  }

  async register(payload: {
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    email: string;
    password: string;
  }): Promise<void> {
    const username = payload.username.trim();
    const firstName = payload.firstName.trim();
    const lastName = payload.lastName.trim();
    const avatarUrl = payload.avatarUrl.trim();
    const email = payload.email.trim();

    if (!username || !firstName || !lastName || !avatarUrl || !email || !payload.password) {
      throw new Error('Completa todos los campos obligatorios.');
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, payload.password);

      await updateProfile(credential.user, {
        displayName: username
      });

      await setDoc(doc(db, 'users', credential.user.uid), {
        uid: credential.user.uid,
        username,
        firstName,
        lastName,
        avatarUrl,
        usernameNorm: normalizeIdentity(username),
        email,
        emailNorm: normalizeIdentity(email),
        role: 'user',
        createdAt: serverTimestamp()
      });

      this.session.setSession({
        uid: credential.user.uid,
        username,
        email,
        role: 'user',
        loginAt: new Date().toISOString()
      });
    } catch (error) {
      throw new Error(this.mapAuthError(error));
    }
  }

  async recover(email: string): Promise<void> {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      throw new Error('Introduce tu correo electrónico.');
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (error) {
      throw new Error(this.mapAuthError(error));
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
    this.session.clearSession();
  }

  private mapAuthError(error: unknown): string {
    const code =
        typeof error === 'object' && error !== null && 'code' in error
            ? String((error as { code?: string }).code)
            : '';

    switch (code) {
      case 'auth/invalid-email':
        return 'El correo electrónico no tiene un formato válido.';

      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrectos.';

      case 'auth/email-already-in-use':
        return 'Ese correo ya está registrado.';

      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';

      case 'auth/operation-not-allowed':
        return 'El acceso con correo y contraseña no está activado en Firebase.';

      case 'auth/network-request-failed':
        return 'No se pudo conectar con Firebase. Revisa la conexión.';

      default:
        return 'No se pudo completar la operación de autenticación.';
    }
  }
}
