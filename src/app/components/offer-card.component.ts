import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Car } from '../models/interfaces';
import { formatPrice } from '../core/utils';

@Component({
  selector: 'app-offer-card',
  imports: [RouterLink],
  template: `
    <article class="gallery-box">
      <div class="image-placeholder">
        <img [src]="car.image" [alt]="car.fullName">
      </div>

      @if (showTitle) {
        <p><strong>{{ car.fullName }}</strong></p>
      }

      <div class="car-card-copy">
        <p>{{ car.shortDescription }}</p>
        <p><strong>{{ car.priceText || formatPrice(car.pricePerDay) }}</strong></p>
      </div>

      <a class="box-link" [routerLink]="['/car', car.id]" [queryParams]="queryParams">Ver vehículo</a>
    </article>
  `,
  styleUrl: '../../../Web/Style/Template_style/offertCard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferCardComponent {
  @Input({ required: true }) car!: Car;
  @Input() showTitle = true;
  @Input() queryParams: Record<string, string | null> = {};

  protected readonly formatPrice = formatPrice;
}
