import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

type RawLocation = {
  id: string;
  name: string;
  Island?: string;
  island?: string;
  isAirport: boolean;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  getCompany(): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/company`).pipe(
      map((company) => ({
        ...company,
        aboutImage: normalizeAssetPath(company.aboutImage),
        historyImage: normalizeAssetPath(company.historyImage),
        locationImage: normalizeAssetPath(company.locationImage),
        mobileIcons: {
          home: normalizeAssetPath(company.mobileIcons.home),
          info: normalizeAssetPath(company.mobileIcons.info),
          reservation: normalizeAssetPath(company.mobileIcons.reservation),
          contact: normalizeAssetPath(company.mobileIcons.contact),
          profile: normalizeAssetPath(company.mobileIcons.profile)
        }
      }))
    );
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<RawLocation[]>(`${this.baseUrl}/locations`).pipe(
      map((locations) =>
        locations.map((location) => ({
          id: String(location.id),
          name: location.name,
          island: location.island ?? location.Island ?? '',
          isAirport: Boolean(location.isAirport)
        }))
      )
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.baseUrl}/cars`).pipe(
      map((cars) =>
        cars.map((car) => ({
          ...car,
          id: String(car.id),
          image: normalizeAssetPath(car.image)
        }))
      )
    );
  }

  getCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.baseUrl}/cars/${id}`).pipe(
      map((car) => ({
        ...car,
        id: String(car.id),
        image: normalizeAssetPath(car.image)
      }))
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  getAuthConfig(): Observable<AuthConfig> {
    return this.http.get<AuthConfig>(`${this.baseUrl}/auth`).pipe(
      map((config) => ({
        login: this.normalizeScreen(config.login),
        register: this.normalizeScreen(config.register),
        recovery: this.normalizeScreen(config.recovery)
      }))
    );
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.baseUrl}/paymentMethods`);
  }

  createContactMessage(message: ContactMessage): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(`${this.baseUrl}/contactMessages`, message);
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/reservations`, reservation);
  }

  getFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.baseUrl}/faqs`);
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
