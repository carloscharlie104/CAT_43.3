import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, of } from 'rxjs';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-faq-page',
  imports: [AsyncPipe],
  template: `
    <main class="faq-page container">
      <div class="faq-container mx-auto px-3 px-md-4">
          <section class="accordion d-flex flex-column gap-3 mx-auto" aria-label="Preguntas frecuentes">
            @if (faqs$ | async; as faqs) {
              @if (faqs.length) {
                @for (faq of faqs; track faq.id) {
                  <details class="acc-item">
                    <summary class="acc-summary d-flex align-items-center justify-content-between">
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
