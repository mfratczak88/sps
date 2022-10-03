import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignInFormData } from '../sign-in.component';

@Component({
  selector: 'sps-email-sign-in-form',
  templateUrl: './email-sign-in-form.component.html',
  styleUrls: ['./email-sign-in-form.component.scss'],
})
export class EmailSignInFormComponent {
  form: FormGroup;

  @Output()
  readonly submit = new EventEmitter<SignInFormData>();

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
