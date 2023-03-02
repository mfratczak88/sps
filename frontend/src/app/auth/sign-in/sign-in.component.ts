import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { concatMap } from 'rxjs';
import { LoginCredentials } from '../../core/model/auth.model';
import { AuthActions } from '../../core/store/actions/auth.actions';
import {
  afterLoginUrl,
  emailFragment,
} from '../../core/store/routing/routing.selector';
import { AuthTranslationKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  readonly translations = AuthTranslationKeys;

  readonly emailFragment$ = this.store.select(emailFragment);

  constructor(readonly store: Store) {}

  onEmailSignIn({ email, password }: LoginCredentials) {
    this.store
      .dispatch(new AuthActions.Login(email, password))
      .pipe(concatMap(() => this.onSuccessfulSignIn()))
      .subscribe();
  }

  onGoogleSignIn() {
    this.store
      .dispatch(new AuthActions.LoginWithGoogle())
      .pipe(concatMap(() => this.onSuccessfulSignIn()))
      .subscribe();
  }

  onSuccessfulSignIn() {
    return this.store.dispatch(
      new AuthActions.NavigateAfterLogin(
        this.store.selectSnapshot(afterLoginUrl),
      ),
    );
  }

  onBack() {
    this.store.dispatch(new AuthActions.NavigateToSameRoute());
  }

  onShowEmailForm() {
    this.store.dispatch(new AuthActions.NavigateToSameRoute('email'));
  }

  toSignUp() {
    this.store.dispatch(new AuthActions.NavigateToSignUp());
  }
}
