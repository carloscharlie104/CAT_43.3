import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact-page',
  imports: [AsyncPipe, ReactiveFormsModule],
  template: `
    <main class="contact-container container">
      @if (company$ | async; as company) {
          <div class="contact-header">
            <h1 class="contact-title">Contacto</h1>
            <p class="contact-description">
              Escríbenos y te responderemos por email o teléfono. También puedes contactar directamente con {{ company.name }}
              en {{ company.email }} o {{ company.phone }}.
            </p>
          </div>

          <form class="contact-form" [formGroup]="form" (ngSubmit)="submit()">
            <div class="form-row row g-3">
              <div class="form-group col-12 col-md-6">
                <label class="form-label" for="name">Nombre</label>
                <input id="name" class="form-input form-control" type="text" formControlName="name" autocomplete="given-name">
              </div>
              <div class="form-group col-12 col-md-6">
                <label class="form-label" for="surname">Apellidos</label>
                <input id="surname" class="form-input form-control" type="text" formControlName="surname" autocomplete="family-name">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="email">Correo electrónico</label>
              <input id="email" class="form-input form-control" type="email" formControlName="email" autocomplete="email">
            </div>

            <div class="form-group">
              <label class="form-label" for="message">Mensaje</label>
              <textarea id="message" class="form-textarea form-control" formControlName="message"></textarea>
            </div>

            @if (statusMessage) {
              <p class="status-text" [class.status-text--error]="statusType === 'error'" [class.status-text--success]="statusType === 'success'">
                {{ statusMessage }}
              </p>
            }

            <div class="bottom-action">
              <button class="btn btn-pink" type="submit">Enviar consulta</button>
            </div>
          </form>
      }
    </main>
  `,
  styleUrl: '../../../../Web/Style/Pages_style/contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactPageComponent {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly company$ = this.api.getCompany();
  protected statusMessage = '';
  protected statusType: 'error' | 'success' = 'success';

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

  async submit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.statusType = 'error';
      this.statusMessage = 'Revisa los campos obligatorios.';
      return;
    }

    try {
      await firstValueFrom(
        this.api.createContactMessage({
          ...this.form.getRawValue(),
          createdAt: new Date().toISOString()
        })
      );
      this.form.reset({ name: '', surname: '', email: '', message: '' });
      this.statusType = 'success';
      this.statusMessage = 'Tu consulta se ha enviado correctamente.';
    } catch {
      this.statusType = 'error';
      this.statusMessage = 'No se pudo enviar la consulta. Inténtalo de nuevo.';
    }
  }
}
