import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/state/auth/auth.service';
import { ToastService } from '../../core/service/toast.service';
import { NavigationService } from '../../core/service/navigation.service';
import { first } from 'rxjs';

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
    private readonly toastService: ToastService,
    readonly navigationService: NavigationService,
  ) {
    this.form = formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  onSubmit() {
    this.authService
      .signUp(this.form.value)
      .pipe(first())
      .subscribe(() =>
        this.navigationService
          .toSignIn()
          .then(() => this.toastService.show('Please check your email')),
      );
  }
}
