import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

import { FeaturedCarouselComponent } from '../../components/featured-carousel.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe, FeaturedCarouselComponent],
  template: `
    <main class="container">
      @if (featuredCars$ | async; as featuredCars) {
        <app-featured-carousel [cars]="featuredCars" />
      }
    </main>
  `,
  styleUrl: '../../../../Web/Style/Pages_style/main.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HomePageComponent {
  private readonly api = inject(ApiService);

  readonly featuredCars$ = this.api.getCars().pipe(
    map((cars) => {
      const featured = cars.filter((car) => car.featured);
      const remaining = cars.filter((car) => !car.featured);
      return [...featured, ...remaining].slice(0, 3);
    }),
    catchError(() => of([]))
  );
}
