import { Component } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../core/service/navigation.service';
import { catchError, first, throwError } from 'rxjs';
import { ToastService } from '../../core/service/toast.service';

@Component({
  selector: 'sps-action-code',
  templateUrl: './action-code.component.html',
  styleUrls: ['./action-code.component.scss'],
})
export class ActionCodeComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly navigationService: NavigationService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    const {
      oobCode,
      mode,
    } = this.navigationService.actionCodeParamsFromActivatedRoute(
      this.activatedRoute,
    );
    if (!oobCode) {
      this.navigationService.to404();
      return;
    }
    if (mode === 'verifyEmail') {
      this.authService
        .verifyEmail(oobCode)
        .pipe(
          first(),
          catchError(error => {
            this.navigationService.toInvalidEmailVerifyLink();
            return throwError(error);
          }),
        )
        .subscribe(() => {
          this.navigationService
            .toSignIn()
            .then(() =>
              this.toastService.show('Email verified. You can now sign in'),
            );
        });
    } else {
      this.navigationService.to404();
    }
  }
}
