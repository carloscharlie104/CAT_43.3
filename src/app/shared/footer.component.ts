import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-footer',
  imports: [AsyncPipe, RouterLink],
  template: `
    <footer class="container-fluid">
      @if (company$ | async; as company) {
        <div class="footer-left col-12 col-md-3">
          <div class="logo-footer">
            <a routerLink="/" aria-label="Inicio">
              <img [src]="logoSrc" [alt]="company.name" class="footer-main-logo">
            </a>
          </div>

          <div class="social-icons">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" class="social-link" aria-label="Instagram">
              <img [src]="instagramSrc" alt="Instagram" class="social-logo">
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" class="social-link" aria-label="Facebook">
              <img [src]="facebookSrc" alt="Facebook" class="social-logo">
            </a>
            <a href="https://www.x.com" target="_blank" rel="noreferrer" class="social-link" aria-label="X">
              <img [src]="twitterSrc" alt="X" class="social-logo">
            </a>
            <a [href]="whatsappHref(company.whatsapp)" target="_blank" rel="noreferrer" class="social-link" aria-label="WhatsApp">
              <img [src]="whatsappSrc" alt="WhatsApp" class="social-logo">
            </a>
          </div>
        </div>

        <div class="footer-links-section row flex-grow-1">
          <div class="footer-column col-12 col-sm">
            <h4>{{ company.name }}</h4>
            <a [href]="'mailto:' + company.email">{{ company.email }}</a>
            <a [href]="'tel:' + company.phone.replaceAll(' ', '')">{{ company.phone }}</a>
            <a [href]="whatsappHref(company.whatsapp)" target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="#">{{ company.address }}</a>
          </div>

          <div class="footer-divider"></div>

          <div class="footer-column col-12 col-sm">
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
  protected readonly logoSrc = 'Assets/Logos/CAT.jpeg';
  protected readonly instagramSrc = 'Assets/Logos/instagram.png';
  protected readonly facebookSrc = 'Assets/Logos/facebook.png';
  protected readonly twitterSrc = 'Assets/Logos/twitter.png';
  protected readonly whatsappSrc = 'Assets/Logos/whatsapp.png';

  readonly company$ = this.api.getCompany();

  whatsappHref(value: string): string {
    return `https://wa.me/${value.replace(/\D/g, '')}`;
  }
}
