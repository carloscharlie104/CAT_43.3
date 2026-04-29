import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { calculateDays } from '../../core/utils';

@Component({
  selector: 'app-car-detail-page',
  imports: [AsyncPipe, RouterLink],
  template: `
    <main class="container">
      @if (vm$ | async; as vm) {
          @if (vm.car) {
            <article class="carData-main row g-4">
              <section class="carData-left col-12 col-lg-7">
                <h1 class="carData-title">{{ vm.car.fullName }}</h1>
                <p class="carData-subtitle">{{ vm.car.shortDescription }}</p>
                <div class="media-box">
                  <img [src]="vm.car.image" [alt]="vm.car.fullName">
                </div>
              </section>

              <section class="carData-right col-12 col-lg-5">
                <div class="detail-section">
                  <h2 class="detail-section-title">Ficha técnica</h2>
                  <div class="detail-grid">
                    <p class="detail-item"><strong>Marca</strong><span>{{ vm.car.brand }}</span></p>
                    <p class="detail-item"><strong>Modelo</strong><span>{{ vm.car.model }}</span></p>
                    <p class="detail-item"><strong>Categoría</strong><span>{{ vm.category }}</span></p>
                    <p class="detail-item"><strong>Transmisión</strong><span>{{ vm.car.transmission }}</span></p>
                    <p class="detail-item"><strong>Combustible</strong><span>{{ vm.car.fuel }}</span></p>
                    <p class="detail-item"><strong>Plazas</strong><span>{{ vm.car.seats }}</span></p>
                    <p class="detail-item"><strong>Equipaje</strong><span>{{ vm.car.luggage }}</span></p>
                    <p class="detail-item"><strong>A/C</strong><span>{{ vm.car.airConditioning ? 'Sí' : 'No' }}</span></p>
                  </div>
                </div>

                <div class="detail-section">
                  <h2 class="detail-section-title">Condiciones</h2>
                  <p class="info-line">{{ vm.car.conditions }}</p>
                  <p class="info-line">Precio por día: {{ vm.car.pricePerDay }} €</p>
                  <p class="info-line">{{ vm.car.description }}</p>
                  @if (vm.days > 0) {
                    <p class="info-line">Reserva estimada de {{ vm.days }} día(s).</p>
                  }
                </div>
              </section>

              <a
                class="cta btn"
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
            </article>
          } @else {
            <section class="carData-main container">
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

  readonly vm$ = this.route.paramMap.pipe(
    switchMap((params) =>
      combineLatest({
        car: this.api.getCarById(params.get('id') ?? '').pipe(catchError(() => of(null))),
        categories: this.api.getCategories(),
        queryParams: this.route.queryParamMap
      })
    ),
    map(({ car, categories, queryParams }) => ({
      car,
      category: categories.find((item) => item.id === car?.categoryId)?.label ?? 'Sin categoría',
      locationId: queryParams.get('locationId'),
      startDate: queryParams.get('startDate'),
      endDate: queryParams.get('endDate'),
      days: calculateDays(queryParams.get('startDate') ?? '', queryParams.get('endDate') ?? '')
    }))
  );
}
