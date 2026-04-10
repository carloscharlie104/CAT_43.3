import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';

import { ApiService } from '../services/api.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, AsyncPipe, RouterLink],
  template: `
    <header>
      @if (vm$ | async; as vm) {
        <div class="header-desktop">
          <div class="header-container">
            <div class="logo-header">
              <a routerLink="/" aria-label="Inicio" class="logo-header-link">
                <img src="/Assets/Logos/CAT.jpeg" [alt]="vm.company.name" class="header-main-logo">
              </a>
            </div>

            <nav class="nav-links" aria-label="Navegación principal">
              <a routerLink="/" class="nav-pill">Inicio</a>
              <a routerLink="/information" class="nav-pill">Información</a>
              <a routerLink="/reservation" class="nav-pill">Reserva</a>
              <a routerLink="/contact" class="nav-pill">Contacto</a>
            </nav>

            <div class="nav-actions">
              @if (vm.session) {
                <div class="nav-session">
                  <span class="nav-pill nav-user">{{ vm.session.username }}</span>
                  <button type="button" class="nav-pill yellow nav-logout-btn" (click)="logout()">Salir</button>
                </div>
              } @else {
                <a routerLink="/login" class="nav-pill yellow">Perfil</a>
              }
            </div>
          </div>
        </div>

        <div class="header-mobile-top">
          <a routerLink="/" class="mobile-top-btn mobile-top-btn--logo" aria-label="Inicio">
            <img src="/Assets/Logos/CAT.jpeg" [alt]="vm.company.name" class="header-mobile-logo">
          </a>

          @if (vm.session) {
            <button type="button" class="mobile-top-btn mobile-top-btn--user app-link-button" (click)="logout()" [attr.aria-label]="'Salir (' + vm.session.username + ')'">
              <img [src]="vm.company.mobileIcons.profile" alt="Perfil" class="header-mobile-icon">
            </button>
          } @else {
            <a routerLink="/login" class="mobile-top-btn mobile-top-btn--user" aria-label="Acceso o registro">
              <img [src]="vm.company.mobileIcons.profile" alt="Perfil" class="header-mobile-icon">
            </a>
          }
        </div>

        <nav class="mobile-bottom-nav" aria-label="Navegación móvil">
          <a routerLink="/" class="mobile-bottom-item">
            <span class="mobile-bottom-icon"><img [src]="vm.company.mobileIcons.home" alt="Inicio" class="mobile-bottom-icon-image"></span>
            <span class="mobile-bottom-text">Inicio</span>
          </a>
          <a routerLink="/information" class="mobile-bottom-item">
            <span class="mobile-bottom-icon"><img [src]="vm.company.mobileIcons.info" alt="Información" class="mobile-bottom-icon-image"></span>
            <span class="mobile-bottom-text">Info</span>
          </a>
          <a routerLink="/reservation" class="mobile-bottom-item">
            <span class="mobile-bottom-icon"><img [src]="vm.company.mobileIcons.reservation" alt="Reserva" class="mobile-bottom-icon-image"></span>
            <span class="mobile-bottom-text">Reserva</span>
          </a>
          <a routerLink="/contact" class="mobile-bottom-item">
            <span class="mobile-bottom-icon"><img [src]="vm.company.mobileIcons.contact" alt="Contacto" class="mobile-bottom-icon-image"></span>
            <span class="mobile-bottom-text">Contacto</span>
          </a>
        </nav>
      }
    </header>
  `,
  styleUrl: '../../../Web/Style/Template_style/header.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  readonly vm$ = combineLatest({
    company: this.api.getCompany(),
    session: this.session.session$
  });

  logout(): void {
    this.session.clearSession();
    void this.router.navigateByUrl('/');
  }
}
