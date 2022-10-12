import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../core/service/navigation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/state/auth/auth.service';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../core/state/auth/auth.model';

@Component({
  selector: 'sps-confirm-password-reset',
  templateUrl: './confirm-password-reset.component.html',
  styleUrls: ['./confirm-password-reset.component.scss'],
})
export class ConfirmPasswordResetComponent {
  form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private readonly navigationService: NavigationService,
    private readonly authService: AuthService,
  ) {
    this.form = formBuilder.group({
      password: [
        null,
        [
          Validators.required,
          Validators.min(PASSWORD_MIN_LENGTH),
          Validators.max(PASSWORD_MAX_LENGTH),
        ],
      ],
      confirmPassword: [null, [Validators.required]],
    });
  }

  onSubmit() {
    const { password, confirmPassword } = this.form.value;
  }
}
