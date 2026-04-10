import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, of } from 'rxjs';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-faq-page',
  imports: [AsyncPipe],
  template: `
    <main class="faq-page">
      <div class="faq-container">
          <section class="faq-filter">
            <div class="faq-filter__bar">
              <button type="button" class="faq-chip">Reservas</button>
              <button type="button" class="faq-chip">Recogida</button>
              <button type="button" class="faq-chip">Pagos</button>
            </div>
          </section>

          <section class="accordion">
            @if (faqs$ | async; as faqs) {
              @if (faqs.length) {
                @for (faq of faqs; track faq.id) {
                  <details class="acc-item">
                    <summary class="acc-summary">
                      <span class="acc-title">{{ faq.question }}</span>
                      <span class="acc-icon" aria-hidden="true"></span>
                    </summary>
                    <div class="acc-panel">
                      <div class="acc-content">{{ faq.answer }}</div>
                    </div>
                  </details>
                }
              } @else {
                <p class="faq-empty">No hay preguntas frecuentes disponibles.</p>
              }
            }
          </section>
      </div>
    </main>
  `,
  styleUrl: '../../../../Web/Style/Pages_style/faq.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqPageComponent {
  private readonly api = inject(ApiService);

  readonly faqs$ = this.api.getFaqs().pipe(catchError(() => of([])));
}
