import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-footer',
  imports: [AsyncPipe, RouterLink],
  template: `
    <footer>
      @if (company$ | async; as company) {
        <div class="footer-left">
          <div class="logo-footer">
            <a routerLink="/" aria-label="Inicio">
              <img src="/Assets/Logos/CAT.jpeg" [alt]="company.name" class="footer-main-logo">
            </a>
          </div>

          <div class="social-icons">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" class="social-link" aria-label="Instagram">
              <img src="/Assets/Logos/instagram.png" alt="Instagram" class="social-logo">
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" class="social-link" aria-label="Facebook">
              <img src="/Assets/Logos/facebook.png" alt="Facebook" class="social-logo">
            </a>
            <a href="https://www.x.com" target="_blank" rel="noreferrer" class="social-link" aria-label="X">
              <img src="/Assets/Logos/twitter.png" alt="X" class="social-logo">
            </a>
            <a [href]="whatsappHref(company.whatsapp)" target="_blank" rel="noreferrer" class="social-link" aria-label="WhatsApp">
              <img src="/Assets/Logos/whatsapp.png" alt="WhatsApp" class="social-logo">
            </a>
          </div>
        </div>

        <div class="footer-links-section">
          <div class="footer-column">
            <h4>{{ company.name }}</h4>
            <a [href]="'mailto:' + company.email">{{ company.email }}</a>
            <a [href]="'tel:' + company.phone.replaceAll(' ', '')">{{ company.phone }}</a>
            <a [href]="whatsappHref(company.whatsapp)" target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="#">{{ company.address }}</a>
          </div>

          <div class="footer-divider"></div>

          <div class="footer-column">
            <h4>Información</h4>
            <a routerLink="/contact">Contacto</a>
            <a routerLink="/faq">FAQ</a>
            <a routerLink="/information">Sobre nosotros</a>
          </div>
        </div>
      }
    </footer>
  `,
  styleUrl: '../../../Web/Style/Template_style/footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  private readonly api = inject(ApiService);

  readonly company$ = this.api.getCompany();

  whatsappHref(value: string): string {
    return `https://wa.me/${value.replace(/\D/g, '')}`;
  }
}
