import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites-page',
  imports: [AsyncPipe, RouterLink],
  template: `
    <main class="container my-4">
      <h1 class="h3 mb-4">Listado de vehículos y favoritos</h1>

      @if (vm$ | async; as vm) {
        <section class="list-group">
          @for (car of vm.cars; track car.id) {
            <a class="list-group-item list-group-item-action d-flex align-items-center gap-3" [routerLink]="['/car', car.id]">
              <img [src]="car.image" [alt]="car.fullName" width="96" height="64" class="rounded object-fit-cover">
              <div class="flex-grow-1">
                <p class="mb-1 fw-semibold">{{ car.fullName }}</p>
                <p class="mb-0 text-body-secondary">{{ car.categoryId }} · {{ car.pricePerDay }} €/día</p>
              </div>
              @if (vm.favoriteIds.has(car.id)) {
                <span class="badge text-bg-warning">Favorito</span>
              } @else {
                <span class="badge text-bg-secondary">No favorito</span>
              }
            </a>
          }
        </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesPageComponent {
  private readonly api = inject(ApiService);
  private readonly favorites = inject(FavoritesService);

  readonly vm$ = combineLatest({
    cars: this.api.getCars(),
    favoriteIds: this.favorites.favorites$
  }).pipe(
    map(({ cars, favoriteIds }) => ({
      cars,
      favoriteIds
    }))
  );
}
