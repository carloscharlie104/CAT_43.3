import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, firstValueFrom, map, switchMap } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';
import { calculateDays } from '../../core/utils';

@Component({
  selector: 'app-payment-gateway-page',
  imports: [AsyncPipe, ReactiveFormsModule],
  template: `
    <main>
      @if (vm$ | async; as vm) {
          <section class="card">
            <div class="contact-header">
              <h1 class="contact-title">{{ vm.title }}</h1>
            </div>

            @if (vm.car) {
              <div class="payment-summary">
                <p><strong>Vehículo:</strong> {{ vm.car.fullName }}</p>
                <p><strong>Precio base:</strong> {{ vm.car.priceText }}</p>
                @if (vm.locationName) {
                  <p><strong>Recogida:</strong> {{ vm.locationName }}</p>
                }
                @if (vm.startDate && vm.endDate) {
                  <p><strong>Fechas:</strong> {{ vm.startDate }} - {{ vm.endDate }}</p>
                }
                @if (vm.days > 0) {
                  <p><strong>Total estimado:</strong> {{ vm.totalPrice }} €</p>
                }
                <p><strong>Métodos disponibles:</strong> {{ vm.paymentMethods }}</p>
              </div>
            }

            <form class="contact-form" [formGroup]="form" (ngSubmit)="submit(vm)">
              <div class="form-group1">
                <label class="form-label" for="name">Nombre</label>
                <input class="form-input" [class.form-input--error]="controlInvalid('name')" id="name" type="text" formControlName="name">
                @if (controlInvalid('name')) {
                  <p class="status-text status-text--error">{{ firstError('name') }}</p>
                }
              </div>
              <div class="form-group1">
                <label class="form-label" for="address">Domicilio</label>
                <input class="form-input" [class.form-input--error]="controlInvalid('address')" id="address" type="text" formControlName="address">
                @if (controlInvalid('address')) {
                  <p class="status-text status-text--error">{{ firstError('address') }}</p>
                }
              </div>
              <div class="form-group2">
                <label class="form-label" for="email">Correo electrónico</label>
                <input class="form-input" [class.form-input--error]="controlInvalid('email')" id="email" type="email" formControlName="email">
                @if (controlInvalid('email')) {
                  <p class="status-text status-text--error">{{ firstError('email') }}</p>
                }
              </div>
              <div class="form-group3">
                <label class="form-label" for="phone">Teléfono</label>
                <input class="form-input" [class.form-input--error]="controlInvalid('phone')" id="phone" type="tel" formControlName="phone">
                @if (controlInvalid('phone')) {
                  <p class="status-text status-text--error">{{ firstError('phone') }}</p>
                }
              </div>
              <div class="form-group3">
                <label class="form-label" for="notes">Método de pago / notas</label>
                <input class="form-input" [class.form-input--error]="controlInvalid('notes')" id="notes" type="text" formControlName="notes" [placeholder]="'Métodos disponibles: ' + vm.paymentMethods">
                @if (controlInvalid('notes')) {
                  <p class="status-text status-text--error">{{ firstError('notes') }}</p>
                }
              </div>

              @if (statusMessage) {
                <p class="status-text" [class.status-text--error]="statusType === 'error'" [class.status-text--success]="statusType === 'success'">
                  {{ statusMessage }}
                </p>
              }

              <div class="bottom-action">
                <button class="btn-pink" type="submit">{{ vm.buttonText }}</button>
              </div>
            </form>
          </section>
      }
    </main>
  `,
  styleUrl: '../../../../Web/Style/Pages_style/paymentGateway.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentGatewayPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  private readonly formBuilder = inject(FormBuilder);

  protected statusMessage = '';
  protected statusType: 'error' | 'success' = 'success';
  protected readonly todayDate = this.toIsoLocalDate(new Date());

  protected readonly form = this.formBuilder.nonNullable.group({
    name: [this.session.snapshot?.username ?? '', [Validators.required, Validators.minLength(2)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    email: [this.session.snapshot?.email ?? '', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    notes: ['', [Validators.required, Validators.minLength(3)]]
  });

  readonly vm$ = this.route.queryParamMap.pipe(
    switchMap((params) =>
      combineLatest({
        paymentMethods: this.api.getPaymentMethods(),
        locations: this.api.getLocations(),
        car: params.get('carId') ? this.api.getCarById(params.get('carId') ?? '') : this.api.getCars().pipe(map(() => null)),
        params: this.route.queryParamMap
      })
    ),
    map(({ paymentMethods, locations, car, params }) => {
      const enabledMethods = paymentMethods.filter((method) => method.enabled).map((method) => method.name);
      const locationId = params.get('locationId') ?? '';
      const startDate = params.get('startDate') ?? '';
      const endDate = params.get('endDate') ?? '';
      const days = calculateDays(startDate, endDate);
      const totalPrice = car ? car.pricePerDay * Math.max(days, 1) : 0;

      return {
        car,
        locationId,
        startDate,
        endDate,
        days,
        totalPrice,
        locationName: locations.find((location) => location.id === locationId)?.name ?? '',
        paymentMethods: enabledMethods.join(', ') || 'Pago en oficina',
        title: car ? `Finaliza tu reserva de ${car.fullName}` : 'Finaliza tu reserva',
        buttonText: car ? `Continuar con ${totalPrice || car.pricePerDay} €` : 'Continuar con la reserva'
      };
    })
  );

  async submit(vm: { car: { id: string } | null; locationId: string; startDate: string; endDate: string; totalPrice: number }): Promise<void> {
    this.form.markAllAsTouched();
    this.statusMessage = '';

    if (this.form.invalid) {
      this.statusType = 'error';
      this.statusMessage = 'Revisa los campos marcados.';
      return;
    }

    if (!vm.car) {
      this.statusType = 'error';
      this.statusMessage = 'No hay un vehículo seleccionado para completar la reserva.';
      return;
    }

    const dateError = this.validateReservationDates(vm.startDate, vm.endDate);
    if (dateError) {
      this.statusType = 'error';
      this.statusMessage = dateError;
      return;
    }

    try {
      const values = this.form.getRawValue();
      await firstValueFrom(
        this.api.createReservation({
          carId: Number(vm.car.id),
          pickupLocationId: Number(vm.locationId || 1),
          returnLocationId: Number(vm.locationId || 1),
          startDate: vm.startDate,
          endDate: vm.endDate,
          customerName: values.name,
          customerEmail: values.email,
          customerPhone: values.phone,
          extraIds: [],
          notes: `${values.address}. ${values.notes}`,
          status: 'pending',
          totalPrice: vm.totalPrice || 0
        })
      );

      this.statusType = 'success';
      this.statusMessage = 'Tu reserva ha quedado registrada correctamente.';
    } catch {
      this.statusType = 'error';
      this.statusMessage = 'No se pudo completar la reserva. Inténtalo de nuevo.';
    }
  }

  private validateReservationDates(startDate: string, endDate: string): string | null {
    if (!startDate || !endDate) {
      return 'Debes seleccionar fechas de recogida y devolución antes de finalizar la reserva.';
    }

    if (startDate < this.todayDate) {
      return 'La fecha de recogida no puede ser anterior a hoy.';
    }

    if (endDate < this.todayDate) {
      return 'La fecha de devolución no puede ser anterior a hoy.';
    }

    if (endDate < startDate) {
      return 'La fecha de devolución no puede ser anterior a la de recogida.';
    }

    return null;
  }

  private toIsoLocalDate(date: Date): string {
    const offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
  }

  protected controlInvalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  protected firstError(name: keyof typeof this.form.controls): string {
    const control = this.form.controls[name];
    if (!control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es obligatorio.';
    }

    if (control.errors['email']) {
      return 'Introduce un correo electrónico válido.';
    }

    if (control.errors['pattern']) {
      return 'El teléfono debe tener 9 dígitos.';
    }

    if (control.errors['minlength']) {
      return `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
    }

    return 'Valor no válido.';
  }
}
