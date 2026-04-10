import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Car } from '../models/interfaces';
import { OfferCardComponent } from './offer-card.component';

@Component({
  selector: 'app-featured-carousel',
  imports: [OfferCardComponent],
  template: `
    @if (cars.length) {
      <section class="gallery-section">
        <div class="gallery-col small-col">
          <h2 class="col-title">Destacado</h2>
          <div class="card-placeholder">
            <app-offer-card [car]="visibleCar(0)" />
          </div>
        </div>

        <div class="gallery-col large-col">
          <h1 class="main-title">Best Sellers</h1>
          <div class="main-card-shell">
            <button class="main-card-arrow main-card-arrow--left" type="button" aria-label="Oferta anterior" (click)="move(-1)">
              &#8249;
            </button>

            <div class="card-placeholder hero-card">
              <app-offer-card [car]="visibleCar(1)" />
            </div>

            <button class="main-card-arrow main-card-arrow--right" type="button" aria-label="Oferta siguiente" (click)="move(1)">
              &#8250;
            </button>
          </div>
        </div>

        <div class="gallery-col small-col">
          <h2 class="col-title">Destacado</h2>
          <div class="card-placeholder">
            <app-offer-card [car]="visibleCar(2)" />
          </div>
        </div>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedCarouselComponent {
  @Input({ required: true }) cars: Car[] = [];
  private startIndex = 0;

  move(offset: number): void {
    if (!this.cars.length) {
      return;
    }

    this.startIndex = (this.startIndex + offset + this.cars.length) % this.cars.length;
  }

  visibleCar(offset: number): Car {
    return this.cars[(this.startIndex + offset) % this.cars.length]!;
  }
}
