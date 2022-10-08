import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/state/auth/auth.service';
import { NavigationService } from '../../core/service/navigation.service';
import { first } from 'rxjs';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../core/state/auth/auth.model';
import { LocalizedValidators } from '../../shared/validator';

@Component({
  selector: 'sps-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  form: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    readonly navigationService: NavigationService,
  ) {
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
    this.authService
      .signUp(this.form.value)
      .pipe(first())
      .subscribe(() => this.navigationService.toSignIn());
  }
}
