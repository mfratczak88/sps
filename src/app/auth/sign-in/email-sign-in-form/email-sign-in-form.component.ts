import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthCredentials } from '../../../core/state/auth/auth.model';
import { LocalizedValidators } from '../../../shared/validator';

@Component({
  selector: 'sps-email-sign-in-form',
  templateUrl: './email-sign-in-form.component.html',
  styleUrls: ['./email-sign-in-form.component.scss'],
})
export class EmailSignInFormComponent {
  form: FormGroup;

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
          LocalizedValidators.minLength(7),
          LocalizedValidators.maxLength(20),
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
