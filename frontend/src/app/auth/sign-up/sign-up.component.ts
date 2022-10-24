import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/state/auth/auth.service';
import { RouterService } from '../../core/state/router/router.service';
import { first } from 'rxjs';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../core/state/auth/auth.model';
import { LocalizedValidators } from '../../shared/validator';
import { AuthTranslationKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  readonly form: FormGroup;

  readonly translations = AuthTranslationKeys;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    readonly routerService: RouterService,
  ) {
    this.form = formBuilder.group({
      name: [null, [LocalizedValidators.required]],
      email: [null, [LocalizedValidators.required, LocalizedValidators.email]],
      password: [
        null,
        [
          LocalizedValidators.required,
          LocalizedValidators.minLength(PASSWORD_MIN_LENGTH),
          LocalizedValidators.maxLength(PASSWORD_MAX_LENGTH),
        ],
      ],
    });
  }

  onSubmit() {
    this.authService
      .register(this.form.value)
      .pipe(first())
      .subscribe(() => this.routerService.toSignIn());
  }
}
