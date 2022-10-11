import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/state/auth/auth.service';
import { filter, first, Subscription } from 'rxjs';
import { NavigationService } from '../../core/service/navigation.service';
import { AuthCredentials } from '../../core/state/auth/auth.model';
import { AuthTranslationKeys } from '../../core/translation-keys';

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
    readonly navigationService: NavigationService,
    readonly authService: AuthService,
  ) {
    this.routeFragmentSub$ = this.navigationService
      .emailFragment$()
      .pipe(filter(f => f))
      .subscribe(() => {
        this.showEmailSignUp = true;
      });
  }

  onEmailSignIn({ email, password }: AuthCredentials) {
    this.authService
      .signIn(email, password)
      .pipe(first())
      .subscribe(() => this.onSuccessfulSignIn());
  }

  onGoogleSignIn() {
    this.authService
      .signInWithGoogle()
      .subscribe(() => this.onSuccessfulSignIn());
  }

  onSuccessfulSignIn() {
    this.navigationService.navigateAfterLogin();
  }

  ngOnDestroy(): void {
    this.routeFragmentSub$.unsubscribe();
  }
}
