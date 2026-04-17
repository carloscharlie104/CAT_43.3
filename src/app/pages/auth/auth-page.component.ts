import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, switchMap } from 'rxjs';

import { AuthCardComponent } from '../../components/auth-card.component';
import { AuthConfig, AuthScreenConfig } from '../../models/interfaces';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

type AuthScreen = keyof AuthConfig;

@Component({
  selector: 'app-auth-page',
  imports: [AsyncPipe, ReactiveFormsModule, AuthCardComponent],
  template: `
    <main class="auth">
      @if (screen$ | async; as screen) {
        <app-auth-card
          [config]="screen.config"
          [form]="form"
          [message]="message"
          [messageType]="messageType"
          (submitted)="submit(screen.key)"
        />
      }
    </main>
  `,
  styleUrl: '../../../../Web/Style/Pages_style/loginRegisterRecovery/login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  protected message = '';
  protected messageType: 'error' | 'success' = 'error';

  protected readonly form = this.formBuilder.group(
    {
      username: [''],
      password: [''],
      email: [''],
      emailRepeat: [''],
      passwordRepeat: [''],
      acceptedTerms: [false]
    },
    {
      validators: [this.matchValidator('email', 'emailRepeat'), this.matchValidator('password', 'passwordRepeat')]
    }
  );

  readonly screen$ = this.route.data.pipe(
    map((data) => (data['screen'] as AuthScreen) ?? 'login'),
    switchMap(async (screenKey) => {
      const config = await firstValueFrom(this.api.getAuthConfig());
      this.configureForm(screenKey, config[screenKey]);
      return { key: screenKey, config: config[screenKey] };
    })
  );

  async submit(screen: AuthScreen): Promise<void> {
    this.form.markAllAsTouched();
    this.message = '';

    if (this.form.invalid) {
      this.messageType = 'error';
      this.message = 'Revisa los campos marcados.';
      return;
    }

    const values = this.form.getRawValue();

    try {
      if (screen === 'login') {
        await this.auth.login(values.username ?? '', values.password ?? '');
        this.messageType = 'success';
        this.message = 'Inicio de sesión correcto.';
        await this.router.navigateByUrl('/');
        return;
      }

      if (screen === 'register') {
        await this.auth.register({
          username: values.username ?? '',
          email: values.email ?? '',
          password: values.password ?? ''
        });
        this.messageType = 'success';
        this.message = 'Registro completado. Ya puedes iniciar sesión.';
        await this.router.navigateByUrl('/login');
        return;
      }

      await this.auth.recover(values.email ?? '');
      this.messageType = 'success';
      this.message = 'Si el correo existe, recibirás instrucciones.';
    } catch (error) {
      this.messageType = 'error';
      this.message = error instanceof Error ? error.message : 'No se pudo completar la operación.';
    }
  }

  private configureForm(screen: AuthScreen, config: AuthScreenConfig): void {
    this.form.reset(
      {
        username: '',
        password: '',
        email: '',
        emailRepeat: '',
        passwordRepeat: '',
        acceptedTerms: false
      },
      { emitEvent: false }
    );

    for (const fieldName of ['username', 'password', 'email', 'emailRepeat', 'passwordRepeat', 'acceptedTerms']) {
      this.form.get(fieldName)?.clearValidators();
    }

    const screenValidators = this.getScreenValidators(screen);

    config.fields.forEach((field) => {
      const control = this.form.get(field.name);
      const validators = [...(screenValidators[field.name] ?? [])];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      if (field.minLength) {
        validators.push(Validators.minLength(field.minLength));
      }

      control?.setValidators(validators);
      control?.updateValueAndValidity({ emitEvent: false });
    });

    if (screen === 'register') {
      this.form.get('acceptedTerms')?.setValidators(Validators.requiredTrue);
      this.form.get('acceptedTerms')?.updateValueAndValidity({ emitEvent: false });
    }
  }

  private getScreenValidators(screen: AuthScreen): Record<string, ValidatorFn[]> {
    if (screen === 'login') {
      return {
        username: [Validators.required],
        password: [Validators.required]
      };
    }

    if (screen === 'register') {
      return {
        username: [Validators.required, Validators.minLength(3)],
        email: [Validators.required, Validators.email],
        emailRepeat: [Validators.required, Validators.email],
        password: [Validators.required, Validators.minLength(6)],
        passwordRepeat: [Validators.required, Validators.minLength(6)],
        acceptedTerms: [Validators.requiredTrue]
      };
    }

    return {
      email: [Validators.required, Validators.email],
      emailRepeat: [Validators.required, Validators.email]
    };
  }

  private matchValidator(sourceKey: string, targetKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const source = control.get(sourceKey)?.value;
      const target = control.get(targetKey)?.value;

      if (!source || !target) {
        return null;
      }

      if (source !== target) {
        control.get(targetKey)?.setErrors({ mismatch: true });
        return { mismatch: true };
      }

      if (control.get(targetKey)?.hasError('mismatch')) {
        const errors = { ...(control.get(targetKey)?.errors ?? {}) };
        delete errors['mismatch'];
        control.get(targetKey)?.setErrors(Object.keys(errors).length ? errors : null);
      }

      return null;
    };
  }
}
