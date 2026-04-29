import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query
} from 'firebase/firestore';
import { catchError, from, map, Observable, of } from 'rxjs';

import {
  AuthConfig,
  AuthScreenConfig,
  Car,
  Category,
  Company,
  ContactMessage,
  Faq,
  Location,
  PaymentMethod,
  Reservation,
  User
} from '../models/interfaces';
import { normalizeAssetPath } from '../core/utils';
import { db } from '../core/firebase';

type RawLocation = {
  id: string;
  name: string;
  Island?: string;
  island?: string;
  isAirport: boolean;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly companyDocId = 'main';
  private readonly authDocId = 'main';
  private readonly fallbackCompany: Company = {
    id: 1,
    name: 'CAT Car Renting Service',
    tagline: 'Renting automotriz simple, dinámico y eficaz.',
    about: '',
    aboutImage: '/Assets/Logos/about.png',
    history: '',
    historyImage: '/Assets/Logos/history.png',
    email: 'info@catrenting.com',
    phone: '+34 928 000 111',
    whatsapp: '+34 600 123 456',
    address: '',
    locationImage: '/Assets/Logos/location.png',
    schedule: '',
    mobileIcons: {
      home: '/Assets/Logos/inicio.png',
      info: '/Assets/Logos/Logo Info.jpg',
      reservation: '/Assets/Logos/reservar.jpg',
      contact: '/Assets/Logos/contacto.webp',
      profile: '/Assets/Logos/perfil.png'
    }
  };

  private collectionRef<T = DocumentData>(name: string): CollectionReference<T> {
    return collection(db, name) as CollectionReference<T>;
  }

  private requireData<T>(value: T | undefined, label: string): T {
    if (!value) {
      throw new Error(`No se encontró el documento de ${label} en Firebase.`);
    }

    return value;
  }

  getCompany(): Observable<Company> {
    return from(getDoc(doc(db, 'company', this.companyDocId))).pipe(
      map((companyDoc) => {
        const company = this.requireData(companyDoc.data() as Company | undefined, 'company/main');
        return {
          ...company,
          aboutImage: normalizeAssetPath(company.aboutImage),
          historyImage: normalizeAssetPath(company.historyImage),
          locationImage: normalizeAssetPath(company.locationImage),
          mobileIcons: {
            home: normalizeAssetPath(company.mobileIcons?.home),
            info: normalizeAssetPath(company.mobileIcons?.info),
            reservation: normalizeAssetPath(company.mobileIcons?.reservation),
            contact: normalizeAssetPath(company.mobileIcons?.contact),
            profile: normalizeAssetPath(company.mobileIcons?.profile)
          }
        };
      }),
      catchError(() => of(this.fallbackCompany))
    );
  }

  getLocations(): Observable<Location[]> {
    return from(getDocs(query(this.collectionRef<RawLocation>('locations')))).pipe(
      map((locations) =>
        locations.docs.map((docSnap) => {
          const location = docSnap.data();
          return {
            id: String(location.id),
            name: location.name,
            island: location.island ?? location.Island ?? '',
            isAirport: Boolean(location.isAirport)
          };
        })
      ),
      catchError(() => of([]))
    );
  }

  getCategories(): Observable<Category[]> {
    return from(getDocs(query(this.collectionRef<Category>('categories')))).pipe(
      map((snapshot) => snapshot.docs.map((docSnap) => docSnap.data())),
      catchError(() => of([]))
    );
  }

  getCars(): Observable<Car[]> {
    return from(getDocs(query(this.collectionRef<Car>('cars')))).pipe(
      map((cars) =>
        cars.docs.map((docSnap) => {
          const car = docSnap.data();
          return {
            ...car,
            id: String(car.id),
            image: normalizeAssetPath(car.image)
          };
        })
      ),
      catchError(() => of([]))
    );
  }

  getCarById(id: string): Observable<Car> {
    return this.getCars().pipe(
      map((cars) => {
        const car = cars.find((item) => String(item.id) === String(id));
        return this.requireData(car, `cars/${id}`);
      })
    );
  }

  getUsers(): Observable<User[]> {
    return from(getDocs(query(this.collectionRef<User>('users')))).pipe(
      map((snapshot) => snapshot.docs.map((docSnap) => docSnap.data())),
      catchError(() => of([]))
    );
  }

  createUser(user: User): Observable<User> {
    return from(
      addDoc(this.collectionRef<User>('users'), user).then((docRef) => ({ ...user, id: docRef.id }))
    );
  }

  getAuthConfig(): Observable<AuthConfig> {
    return from(getDoc(doc(db, 'auth', this.authDocId))).pipe(
      map((configDoc) => {
        const config = this.requireData(configDoc.data() as AuthConfig | undefined, 'auth/main');
        return {
          login: this.normalizeScreen(config.login),
          register: this.normalizeScreen(config.register),
          recovery: this.normalizeScreen(config.recovery)
        };
      }),
      catchError(() =>
        of({
          login: {
            title: 'Inicia sesión',
            formId: 'login-form',
            fields: [],
            submitText: 'Entrar'
          },
          register: {
            title: 'Crear cuenta',
            formId: 'register-form',
            fields: [],
            submitText: 'Crear cuenta'
          },
          recovery: {
            title: 'Recuperar contraseña',
            formId: 'recovery-form',
            fields: [],
            submitText: 'Enviar'
          }
        })
      )
    );
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return from(getDocs(query(this.collectionRef<PaymentMethod>('paymentMethods')))).pipe(
      map((snapshot) => snapshot.docs.map((docSnap) => docSnap.data())),
      catchError(() => of([]))
    );
  }

  createContactMessage(message: ContactMessage): Observable<ContactMessage> {
    return from(
      addDoc(this.collectionRef<ContactMessage>('contactMessages'), message).then((docRef) => ({
        ...message,
        id: docRef.id
      }))
    );
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return from(
      addDoc(this.collectionRef<Reservation>('reservations'), reservation).then((docRef) => ({
        ...reservation,
        id: docRef.id
      }))
    );
  }

  getFaqs(): Observable<Faq[]> {
    return from(getDocs(query(this.collectionRef<Faq>('faqs')))).pipe(
      map((snapshot) => snapshot.docs.map((docSnap) => docSnap.data())),
      catchError(() => of([]))
    );
  }

  private normalizeScreen(screen: AuthScreenConfig): AuthScreenConfig {
    return {
      ...screen,
      links: screen.links
        ? {
            primary: screen.links.primary
              ? { ...screen.links.primary, href: this.normalizeAuthHref(screen.links.primary.href) }
              : undefined,
            secondary: screen.links.secondary
              ? { ...screen.links.secondary, href: this.normalizeAuthHref(screen.links.secondary.href) }
              : undefined
          }
        : undefined,
      backLink: screen.backLink
        ? { ...screen.backLink, href: this.normalizeAuthHref(screen.backLink.href) }
        : undefined
    };
  }

  private normalizeAuthHref(href: string): string {
    if (href.includes('register')) {
      return '/register';
    }

    if (href.includes('passRecovery') || href.includes('recovery')) {
      return '/recovery';
    }

    return '/login';
  }
}
