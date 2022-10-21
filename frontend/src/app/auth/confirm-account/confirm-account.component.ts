import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../core/state/router/router.service';
import { ToastService } from '../../core/service/toast.service';
import { AuthService } from '../../core/state/auth/auth.service';
import { RouterQuery } from '../../core/state/router/router.query';
import { catchError, first, NEVER } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse, MessageCode } from '../../core/model/error.model';
import { AuthTranslationKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-confirm-account',
  template: '',
})
export class ConfirmAccountComponent implements OnInit {
  constructor(
    private readonly routerQuery: RouterQuery,
    private readonly routerService: RouterService,
    private readonly toastService: ToastService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    const activationGuid = this.routerQuery.activationGuid;
    if (!activationGuid) {
      this.routerService.to404();
      return;
    }
    this.authService
      .confirmRegistration(activationGuid)
      .pipe(
        first(),
        catchError((err: HttpErrorResponse) => {
          if (
            (err.error as ErrorResponse)?.messageCode ===
            MessageCode.URL_NO_LONGER_VALID
          ) {
            this.routerService.toResendActivationLink(activationGuid);
            return NEVER;
          }
          throw err;
        }),
      )
      .subscribe(() => {
        this.toastService.show(AuthTranslationKeys.ACCOUNT_CONFIRMED);
        this.routerService.toSignIn();
      });
  }
}
