import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/state/auth/auth.service';
import { NavigationService } from '../../core/service/navigation.service';
import { first } from 'rxjs';
import { ToastService } from '../../core/service/toast.service';

@Component({
  selector: 'sps-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private readonly authService: AuthService,
    readonly navigationService: NavigationService,
    private readonly toastService: ToastService,
  ) {
    this.form = formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    const { email } = this.form.value;
    this.authService
      .sendResetPasswordEmail(email)
      .pipe(first())
      .subscribe(() => {
        this.navigationService
          .toSignIn()
          .then(() =>
            this.toastService.show(
              'Password reset email sent. Please check your mailbox',
            ),
          );
      });
  }
}
