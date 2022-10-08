import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/state/auth/auth.service';
import { first } from 'rxjs';
import { NavigationService } from '../../core/service/navigation.service';
import { AuthCredentials } from '../../core/state/auth/auth.model';

@Component({
  selector: 'sps-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  showEmailSignUp = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    readonly navigationService: NavigationService,
    readonly authService: AuthService,
  ) {
    this.activatedRoute.fragment.subscribe(f => {
      this.showEmailSignUp = f === 'email';
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
    this.navigationService.navigateAfterLogin(this.activatedRoute);
  }
}
