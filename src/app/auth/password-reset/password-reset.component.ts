import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/state/auth/auth.service';
import { NavigationService } from '../../core/service/navigation.service';
import { concatMap, first } from 'rxjs';
import { LocalizedValidators } from '../../shared/validator';
import { AuthTranslationKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  readonly form: FormGroup;

  readonly translations = AuthTranslationKeys;

  constructor(
    formBuilder: FormBuilder,
    private readonly authService: AuthService,
    readonly navigationService: NavigationService,
  ) {
    this.form = formBuilder.group({
      email: [null, [LocalizedValidators.required, LocalizedValidators.email]],
    });
  }

  onSubmit() {
    const { email } = this.form.value;
    this.authService
      .sendResetPasswordEmail(email)
      .pipe(
        first(),
        concatMap(() => this.navigationService.toSignIn()),
      )
      .subscribe();
  }
}
