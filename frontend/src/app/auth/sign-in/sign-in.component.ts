import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/state/auth/auth.service';
import { first, Subscription } from 'rxjs';
import { RouterService } from '../../core/state/router/router.service';
import { LoginCredentials } from '../../core/state/auth/auth.model';
import { AuthTranslationKeys } from '../../core/translation-keys';
import { RouterQuery } from '../../core/state/router/router.query';

@Component({
  selector: 'sps-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnDestroy {
  showEmailSignUp = false;

  readonly translations = AuthTranslationKeys;

  private readonly routeFragmentSub$: Subscription;

  constructor(
    readonly routerService: RouterService,
    readonly routerQuery: RouterQuery,
    readonly authService: AuthService,
  ) {
    this.routeFragmentSub$ = this.routerQuery
      .emailFragment$()
      .subscribe(emailFragment => {
        this.showEmailSignUp = emailFragment;
      });
  }

  onEmailSignIn({ email, password }: LoginCredentials) {
    this.authService
      .login(email, password)
      .pipe(first())
      .subscribe(() => this.onSuccessfulSignIn());
  }

  onGoogleSignIn() {
    this.authService
      .loginWithGoogle()
      .subscribe(() => this.onSuccessfulSignIn());
  }

  onSuccessfulSignIn() {
    this.routerService.navigateAfterLogin();
  }

  ngOnDestroy(): void {
    this.routeFragmentSub$.unsubscribe();
  }
}
