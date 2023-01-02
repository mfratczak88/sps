import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { concatMap, first } from 'rxjs';
import { LocalizedValidators } from '../../shared/validator';
import { AuthTranslationKeys } from '../../core/translation-keys';
import { Store } from '@ngxs/store';
import { AuthActions } from '../../core/store/actions/auth.actions';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../core/model/auth.model';

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
    private readonly store: Store,
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

  toSignIn() {
    this.store.dispatch(new AuthActions.NavigateToSignIn());
  }

  onSubmit() {
    const { name, email, password } = this.form.value;
    this.store
      .dispatch(new AuthActions.Register(name, email, password))
      .pipe(
        concatMap(() =>
          this.store.dispatch(new AuthActions.NavigateToSignIn()),
        ),
        first(),
      )
      .subscribe();
  }
}
