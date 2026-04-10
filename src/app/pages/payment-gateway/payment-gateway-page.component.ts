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
                <input class="form-input" id="name" type="text" formControlName="name">
              </div>
              <div class="form-group1">
                <label class="form-label" for="address">Domicilio</label>
                <input class="form-input" id="address" type="text" formControlName="address">
              </div>
              <div class="form-group2">
                <label class="form-label" for="email">Correo electrónico</label>
                <input class="form-input" id="email" type="email" formControlName="email">
              </div>
              <div class="form-group3">
                <label class="form-label" for="phone">Teléfono</label>
                <input class="form-input" id="phone" type="tel" formControlName="phone">
              </div>
              <div class="form-group3">
                <label class="form-label" for="notes">Método de pago / notas</label>
                <input class="form-input" id="notes" type="text" formControlName="notes" [placeholder]="'Métodos disponibles: ' + vm.paymentMethods">
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

  protected readonly form = this.formBuilder.nonNullable.group({
    name: [this.session.snapshot?.username ?? '', Validators.required],
    address: ['', Validators.required],
    email: [this.session.snapshot?.email ?? '', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    notes: ['', Validators.required]
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

    try {
      const values = this.form.getRawValue();
      await firstValueFrom(
        this.api.createReservation({
          carId: Number(vm.car.id),
          pickupLocationId: Number(vm.locationId || 1),
          returnLocationId: Number(vm.locationId || 1),
          startDate: vm.startDate || new Date().toISOString().split('T')[0]!,
          endDate: vm.endDate || new Date().toISOString().split('T')[0]!,
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
}
