import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthScreenConfig } from '../models/interfaces';

@Component({
  selector: 'app-auth-card',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-card" aria-labelledby="auth-title">
      <h1 id="auth-title" class="auth-card__title">{{ config.title }}</h1>

      @if (config.description) {
        <p class="auth-card__description">{{ config.description }}</p>
      }

      <form class="auth-card__form" [formGroup]="form" (ngSubmit)="submitted.emit()">
        @if (message) {
          <div class="form-message" [class.form-message--error]="messageType === 'error'" [class.form-message--success]="messageType === 'success'">
            {{ message }}
          </div>
        }

        @for (field of config.fields; track field.id) {
          <div class="field" [class.field--error]="controlInvalid(field.name)">
            <span class="field__icon-left" aria-hidden="true">×</span>
            <label class="field__label" [for]="field.id">{{ field.label }}</label>
            <input
              class="field__input"
              [id]="field.id"
              [type]="field.type"
              [attr.autocomplete]="field.autocomplete"
              [attr.placeholder]="field.placeholder"
              [formControlName]="field.name"
            >
            <button class="field__clear" type="button" [class.is-visible]="hasValue(field.name)" [attr.aria-label]="field.clearLabel" (click)="clear(field.name)"></button>
            @if (controlInvalid(field.name)) {
              <div class="field__error">{{ firstError(field.name) }}</div>
            }
          </div>
        }

        @if (config.checkText) {
          <label class="check" [class.check--error]="controlInvalid('acceptedTerms')">
            <input class="check__input" type="checkbox" formControlName="acceptedTerms">
            <span class="check__text">{{ config.checkText }}</span>
          </label>
        }

        <button class="auth-card__btn" type="submit">{{ config.submitText }}</button>

        @if (config.links?.primary || config.links?.secondary) {
          <div class="auth-card__links-row">
            @if (config.links?.primary) {
              <a class="auth-card__link" [routerLink]="config.links?.primary?.href">{{ config.links?.primary?.text }}</a>
            }
            @if (config.links?.secondary) {
              <a class="auth-card__link auth-card__link--register" [routerLink]="config.links?.secondary?.href">{{ config.links?.secondary?.text }}</a>
            }
          </div>
        }

        @if (config.backLink) {
          <a class="auth-card__link" [routerLink]="config.backLink.href">{{ config.backLink.text }}</a>
        }
      </form>
    </section>
  `,
  styleUrl: '../../../Web/Style/Template_style/auth-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthCardComponent {
  @Input({ required: true }) config!: AuthScreenConfig;
  @Input({ required: true }) form!: FormGroup;
  @Input() message = '';
  @Input() messageType: 'error' | 'success' = 'error';
  @Output() submitted = new EventEmitter<void>();

  clear(name: string): void {
    this.form.get(name)?.setValue('');
    this.form.get(name)?.markAsPristine();
  }

  hasValue(name: string): boolean {
    return Boolean(this.form.get(name)?.value);
  }

  controlInvalid(name: string): boolean {
    const control = this.form.get(name);
    return Boolean(control && control.invalid && (control.dirty || control.touched));
  }

  firstError(name: string): string {
    const control = this.form.get(name);

    if (!control?.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es obligatorio.';
    }

    if (control.errors['requiredTrue']) {
      return 'Debes aceptar las condiciones.';
    }

    if (control.errors['email']) {
      return 'Introduce un correo válido.';
    }

    if (control.errors['minlength']) {
      return `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
    }

    if (control.errors['mismatch']) {
      return 'Los valores no coinciden.';
    }

    return 'Revisa este campo.';
  }
}
