import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthCredentials } from '../../../core/state/auth/auth.model';

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
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(20),
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
