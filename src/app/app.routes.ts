import { Routes } from '@angular/router';

import { AuthPageComponent } from './pages/auth/auth-page.component';
import { CarDetailPageComponent } from './pages/car-detail/car-detail-page.component';
import { ContactPageComponent } from './pages/contact/contact-page.component';
import { FaqPageComponent } from './pages/faq/faq-page.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { InformationPageComponent } from './pages/information/information-page.component';
import { PaymentGatewayPageComponent } from './pages/payment-gateway/payment-gateway-page.component';
import { ReservationPageComponent } from './pages/reservation/reservation-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomePageComponent },
  { path: 'reservation', component: ReservationPageComponent },
  { path: 'car/:id', component: CarDetailPageComponent },
  { path: 'information', component: InformationPageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'payment', component: PaymentGatewayPageComponent },
  { path: 'faq', component: FaqPageComponent },
  { path: 'login', component: AuthPageComponent, data: { screen: 'login' } },
  { path: 'register', component: AuthPageComponent, data: { screen: 'register' } },
  { path: 'recovery', component: AuthPageComponent, data: { screen: 'recovery' } },
  { path: 'home', redirectTo: '' },
  { path: 'cars/:id', redirectTo: 'car/:id' },
  { path: 'auth/login', redirectTo: 'login' },
  { path: 'auth/register', redirectTo: 'register' },
  { path: 'auth/recovery', redirectTo: 'recovery' },
  { path: '**', redirectTo: '' }
];
