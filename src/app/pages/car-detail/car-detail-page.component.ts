import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { calculateDays } from '../../core/utils';
import { FavoritesService } from '../../services/favorites.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-car-detail-page',
  imports: [AsyncPipe, RouterLink],
  template: `
    <main class="container">
      @if (vm$ | async; as vm) {
          @if (vm.car) {
            <article class="carData-main row g-4 g-lg-5 align-items-start my-4 p-4 p-md-5 rounded-3">
              <section class="carData-left col-12 col-lg-6 d-flex flex-column gap-3">
                <h1 class="carData-title">{{ vm.car.fullName }}</h1>
                <p class="carData-subtitle">{{ vm.car.shortDescription }}</p>
                <div class="media-box rounded-3">
                  <img class="rounded-3" [src]="vm.car.image" [alt]="vm.car.fullName">
                </div>
              </section>

              <section class="carData-right col-12 col-lg-6 d-flex flex-column gap-4">
                <div class="detail-section pb-4">
                  <h2 class="detail-section-title">Ficha técnica</h2>
                  <div class="detail-grid row g-3">
                    <p class="detail-item col-6"><strong>Marca</strong><span>{{ vm.car.brand }}</span></p>
                    <p class="detail-item col-6"><strong>Modelo</strong><span>{{ vm.car.model }}</span></p>
                    <p class="detail-item col-6"><strong>Categoría</strong><span>{{ vm.category }}</span></p>
                    <p class="detail-item col-6"><strong>Transmisión</strong><span>{{ vm.car.transmission }}</span></p>
                    <p class="detail-item col-6"><strong>Combustible</strong><span>{{ vm.car.fuel }}</span></p>
                    <p class="detail-item col-6"><strong>Plazas</strong><span>{{ vm.car.seats }}</span></p>
                    <p class="detail-item col-6"><strong>Equipaje</strong><span>{{ vm.car.luggage }}</span></p>
                    <p class="detail-item col-6"><strong>A/C</strong><span>{{ vm.car.airConditioning ? 'Sí' : 'No' }}</span></p>
                  </div>
                </div>

                <div class="detail-section pb-4">
                  <h2 class="detail-section-title">Condiciones</h2>
                  <p class="info-line">{{ vm.car.conditions }}</p>
                  <p class="info-line">Precio por día: {{ vm.car.pricePerDay }} €</p>
                  <p class="info-line">{{ vm.car.description }}</p>
                  @if (vm.days > 0) {
                    <p class="info-line">Reserva estimada de {{ vm.days }} día(s).</p>
                  }
                </div>

                <div class="d-flex justify-content-end">
                  @if (vm.isLogged) {
                    <button
                      type="button"
                      class="btn me-2"
                      [class.btn-outline-warning]="!vm.isFavorite"
                      [class.btn-warning]="vm.isFavorite"
                      (click)="toggleFavorite(vm.car.id)"
                    >
                      {{ vm.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
                    </button>
                  }
                  <a
                    class="cta btn btn-pink"
                    [routerLink]="['/payment']"
                    [queryParams]="{
                      carId: vm.car.id,
                      locationId: vm.locationId,
                      startDate: vm.startDate,
                      endDate: vm.endDate
                    }"
                  >
                    Reservar vehículo
                  </a>
                </div>
              </section>
            </article>
          } @else {
            <section class="carData-main container my-4 p-4 rounded-3">
              <p class="info-line">No se pudo cargar el vehículo solicitado.</p>
            </section>
          }
        }
    </main>
  `,
  styleUrl: '../../../../Web/Style/Pages_style/carData.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly favorites = inject(FavoritesService);
  private readonly session = inject(SessionService);

  readonly vm$ = this.route.paramMap.pipe(
    switchMap((params) =>
      combineLatest({
        car: this.api.getCarById(params.get('id') ?? '').pipe(catchError(() => of(null))),
        categories: this.api.getCategories(),
        queryParams: this.route.queryParamMap,
        favoriteIds: this.favorites.favorites$,
        session: this.session.session$
      })
    ),
    map(({ car, categories, queryParams, favoriteIds, session }) => ({
      car,
      category: categories.find((item) => item.id === car?.categoryId)?.label ?? 'Sin categoría',
      locationId: queryParams.get('locationId'),
      startDate: queryParams.get('startDate'),
      endDate: queryParams.get('endDate'),
      days: calculateDays(queryParams.get('startDate') ?? '', queryParams.get('endDate') ?? ''),
      isFavorite: car ? favoriteIds.has(car.id) : false,
      isLogged: Boolean(session)
    }))
  );

  async toggleFavorite(carId: string): Promise<void> {
    await this.favorites.toggleFavorite(carId);
  }
}
