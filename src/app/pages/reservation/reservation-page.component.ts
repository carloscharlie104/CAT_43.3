import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { Car, Category, Location } from '../../models/interfaces';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reservation-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="reservation-main container">
      <section class="reservation-form">
          <h1 class="form-main-title">Reserva tu vehículo</h1>

          <form [formGroup]="form" (ngSubmit)="applyFilters()">
            <div class="input-group">
              <label>Isla
                <select class="input-full form-select" formControlName="island" (change)="onIslandChange()">
                  <option value="">Selecciona una isla</option>
                  @for (island of islands; track island) {
                    <option [value]="island">{{ island }}</option>
                  }
                </select>
              </label>
            </div>

            <div class="input-group">
              <label>Recoge tu coche
                <select class="input-full form-select" formControlName="locationId">
                  <option value="">Selecciona una localización</option>
                  @for (location of filteredLocations; track location.id) {
                    <option [value]="location.id">{{ location.name }}{{ location.isAirport ? ' (Aeropuerto)' : '' }}</option>
                  }
                </select>
              </label>
            </div>

            <div class="input-row">
              <div class="input-group-half">
                <label>Fecha inicio
                  <input class="input-half form-control" type="date" formControlName="startDate" [attr.min]="todayDate">
                </label>
              </div>
              <div class="input-group-half">
                <label>Fecha fin
                  <input class="input-half form-control" type="date" formControlName="endDate" [attr.min]="endDateMin">
                </label>
              </div>
            </div>

            @if (dateErrorMessage) {
              <p class="reservation-empty">{{ dateErrorMessage }}</p>
            }

            <div class="submit-container">
              <button class="btn btn-pink" type="submit">Explorar coches</button>
            </div>
          </form>
        </section>

        <section class="reservation-gallery">
          <div class="gallery-border-container">
            <div class="cards-grid">
              @if (filteredCars.length) {
                @for (car of filteredCars; track car.id) {
                  <article class="grid-item">
                    <h3 class="item-title">{{ car.fullName }}</h3>
                    <div class="reservation-card">
                      <img class="reservation-card-image" [src]="car.image" [alt]="car.fullName">

                      <div class="reservation-card-body">
                        <p class="reservation-card-category">{{ categoryLabel(car.categoryId) }}</p>
                        <p class="reservation-card-price">{{ car.priceText }}</p>
                        <p class="reservation-card-location">{{ primaryLocation(car.locationIds) }}</p>
                        <a class="reservation-card-link" [routerLink]="['/car', car.id]" [queryParams]="currentQueryParams()">Ver detalle</a>
                      </div>
                    </div>
                  </article>
                }
              } @else {
                <p class="reservation-empty">No hay coches disponibles con ese filtro.</p>
              }
            </div>
          </div>
        </section>
    </main>
  `,
  styleUrl: '../../../../Web/Style/Pages_style/reservation.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationPageComponent {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly todayDate = this.toIsoLocalDate(new Date());
  protected dateErrorMessage = '';

  protected readonly form = this.formBuilder.nonNullable.group(
    {
      island: '',
      locationId: '',
      startDate: '',
      endDate: ''
    },
    {
      validators: [this.reservationDatesValidator()]
    }
  );

  protected cars: Car[] = [];
  protected categories: Category[] = [];
  protected locations: Location[] = [];
  protected filteredLocations: Location[] = [];
  protected islands: string[] = [];
  protected filteredCars: Car[] = [];

  constructor() {
    this.form.controls.startDate.valueChanges.subscribe((startDate) => {
      const endDate = this.form.controls.endDate.value;
      if (startDate && endDate && endDate < startDate) {
        this.form.patchValue({ endDate: '' });
      }
    });

    forkJoin({
      cars: this.api.getCars(),
      categories: this.api.getCategories(),
      locations: this.api.getLocations()
    })
      .pipe(catchError(() => of({ cars: [], categories: [], locations: [] })))
      .subscribe(({ cars, categories, locations }) => {
        this.cars = cars;
        this.categories = categories;
        this.locations = locations;
        this.islands = [...new Set(locations.map((location) => location.island))];
        this.filteredLocations = locations;
        this.filteredCars = cars;
      });
  }

  onIslandChange(): void {
    const island = this.form.getRawValue().island;
    this.filteredLocations = island
      ? this.locations.filter((location) => location.island === island)
      : this.locations;

    if (!this.filteredLocations.some((location) => location.id === this.form.getRawValue().locationId)) {
      this.form.patchValue({ locationId: '' });
    }
  }

  applyFilters(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    this.dateErrorMessage = this.resolveDateErrorMessage();

    if (this.form.invalid) {
      return;
    }

    const { island, locationId } = this.form.getRawValue();

    this.filteredCars = this.cars.filter((car) => {
      const matchesIsland = island
        ? car.locationIds.some((id) => this.locations.find((location) => location.id === id)?.island === island)
        : true;
      const matchesLocation = locationId ? car.locationIds.includes(locationId) : true;

      return matchesIsland && matchesLocation;
    });
  }

  categoryLabel(categoryId: string): string {
    return this.categories.find((category) => category.id === categoryId)?.label ?? 'Sin categoría';
  }

  primaryLocation(locationIds: string[]): string {
    const selectedLocationId = this.form.getRawValue().locationId;

    if (selectedLocationId) {
      return this.locations.find((location) => location.id === selectedLocationId)?.name ?? 'Ubicación pendiente';
    }

    return this.locations.find((location) => location.id === locationIds[0])?.name ?? 'Ubicación pendiente';
  }

  currentQueryParams(): Record<string, string> {
    const { locationId, startDate, endDate } = this.form.getRawValue();

    return {
      locationId,
      startDate,
      endDate
    };
  }

  get endDateMin(): string {
    const startDate = this.form.controls.startDate.value;
    return startDate && startDate > this.todayDate ? startDate : this.todayDate;
  }

  private reservationDatesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = String(control.get('startDate')?.value ?? '');
      const endDate = String(control.get('endDate')?.value ?? '');

      if (startDate && startDate < this.todayDate) {
        return { startDatePast: true };
      }

      if (endDate && endDate < this.todayDate) {
        return { endDatePast: true };
      }

      if (startDate && endDate && endDate < startDate) {
        return { endBeforeStart: true };
      }

      return null;
    };
  }

  private resolveDateErrorMessage(): string {
    const errors = this.form.errors;
    if (!errors) {
      return '';
    }

    if (errors['startDatePast']) {
      return 'La fecha de recogida no puede ser anterior a hoy.';
    }

    if (errors['endDatePast']) {
      return 'La fecha de devolución no puede ser anterior a hoy.';
    }

    if (errors['endBeforeStart']) {
      return 'La fecha de devolución no puede ser anterior a la fecha de recogida.';
    }

    return '';
  }

  private toIsoLocalDate(date: Date): string {
    const offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
  }
}
