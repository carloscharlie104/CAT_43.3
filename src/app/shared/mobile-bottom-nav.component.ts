import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-mobile-bottom-nav',
  imports: [AsyncPipe, RouterLink],
  template: `
    @if (company$ | async; as company) {
      <nav class="mobile-bottom-nav" aria-label="Navegación móvil">
        <a routerLink="/" class="mobile-bottom-item">
          <span class="mobile-bottom-icon"><img [src]="company.mobileIcons.home" alt="Inicio" class="mobile-bottom-icon-image"></span>
          <span class="mobile-bottom-text">Inicio</span>
        </a>
        <a routerLink="/information" class="mobile-bottom-item">
          <span class="mobile-bottom-icon"><img [src]="company.mobileIcons.info" alt="Información" class="mobile-bottom-icon-image"></span>
          <span class="mobile-bottom-text">Info</span>
        </a>
        <a routerLink="/reservation" class="mobile-bottom-item">
          <span class="mobile-bottom-icon"><img [src]="company.mobileIcons.reservation" alt="Reserva" class="mobile-bottom-icon-image"></span>
          <span class="mobile-bottom-text">Reserva</span>
        </a>
        <a routerLink="/favorites" class="mobile-bottom-item">
          <span class="mobile-bottom-icon"><img [src]="company.mobileIcons.profile" alt="Favoritos" class="mobile-bottom-icon-image"></span>
          <span class="mobile-bottom-text">Fav</span>
        </a>
        <a routerLink="/contact" class="mobile-bottom-item">
          <span class="mobile-bottom-icon"><img [src]="company.mobileIcons.contact" alt="Contacto" class="mobile-bottom-icon-image"></span>
          <span class="mobile-bottom-text">Contacto</span>
        </a>
      </nav>
    }
  `,
  styles: [`
    .mobile-bottom-nav {
      display: none;
    }

    @media (max-width: 768px) {
      :host {
        display: block;
        flex: 0 0 auto;
      }

      .mobile-bottom-nav {
        position: fixed;
        left: 50%;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
        transform: translateX(-50%);
        z-index: 999999;

        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0;

        width: calc(100% - 24px);
        max-width: 380px;

        margin: 0;
        background: #d9d9d9;
        border-radius: 18px;
        padding: 10px 8px 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
      }

      .mobile-bottom-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        text-decoration: none;
        color: #111;
        font-size: 0.72rem;
        line-height: 1;
      }

      .mobile-bottom-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #f4f4f4;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mobile-bottom-icon-image {
        width: 18px;
        height: 18px;
        object-fit: contain;
        display: block;
      }

      .mobile-bottom-text {
        display: block;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileBottomNavComponent {
  private readonly api = inject(ApiService);

  readonly company$ = this.api.getCompany();
}
