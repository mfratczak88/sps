import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AuthCredentials,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../../core/state/auth/auth.model';
import { LocalizedValidators } from '../../../shared/validator';
import { AuthTranslationKeys } from '../../../core/translation-keys';

@Component({
  selector: 'sps-email-sign-in-form',
  templateUrl: './email-sign-in-form.component.html',
  styleUrls: ['./email-sign-in-form.component.scss'],
})
export class EmailSignInFormComponent {
  readonly form: FormGroup;

  readonly translations = AuthTranslationKeys;

  @Output()
  readonly submit = new EventEmitter<AuthCredentials>();

  @Output()
  readonly back = new EventEmitter<void>();

  @Output()
  readonly noAccount = new EventEmitter<void>();

  @Output()
  readonly forgotPassword = new EventEmitter<void>();

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
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
    const { email, password } = this.form.value;
    this.form.reset();
    this.submit.emit({ email, password });
  }
}
