import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { ToastService } from '../../core/service/toast.service';
import { first } from 'rxjs';
import { NavigationService } from '../../core/service/navigation.service';
import { AuthCredentials } from '../../core/model/auth.model';

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
    private readonly toastService: ToastService,
  ) {
    this.activatedRoute.fragment.subscribe(f => {
      this.showEmailSignUp = f === 'email';
    });
  }

  onEmailSignIn({ email, password }: AuthCredentials) {
    this.authService
      .signIn(email, password)
      .pipe(first())
      .subscribe(() => {
        this.navigationService
          .navigateAfterLogin(this.activatedRoute)
          .then(() => this.toastService.show('Login success !'));
      });
  }
}
