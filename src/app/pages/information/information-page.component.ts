import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';

import { InfoCardsComponent } from '../../components/info-cards.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-information-page',
  imports: [AsyncPipe, RouterLink, InfoCardsComponent],
  template: `
    <main class="container">
      @if (vm$ | async; as vm) {
        <app-info-cards [company]="vm.company" [locations]="vm.locations" />

        <section class="bottom-action d-flex align-items-center justify-content-between gap-3">
          <p class="bottom-quote">"{{ vm.company.tagline }}"</p>
          <div class="bottom-btn-container">
            <a class="btn btn-pink" routerLink="/contact">Contactar con CAT</a>
          </div>
        </section>
      }
    </main>
  `,
  styleUrl: '../../../../Web/Style/Pages_style/information.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformationPageComponent {
  private readonly api = inject(ApiService);

  readonly vm$ = combineLatest({
    company: this.api.getCompany(),
    locations: this.api.getLocations()
  });
}
