import { Component } from '@angular/core';
import { AuthService } from '../../core/state/auth/auth.service';
import { RouterService } from '../../core/state/router/router.service';
import { catchError, concatMap, first } from 'rxjs';
import { AuthActionMode } from '../../core/state/auth/auth.model';
import { RouterQuery } from '../../core/state/router/router.query';

@Component({
  selector: 'sps-action-code',
  template: '',
})
export class ActionCodeComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly routerService: RouterService,
    private readonly routerQuery: RouterQuery,
  ) {}

  ngOnInit(): void {
    const { actionCode, mode } = this.routerQuery.authActionParams();
    if (!actionCode) {
      this.routerService.to404();
      return;
    }
    if (mode === AuthActionMode.VERIFY_EMAIL) {
      this.authService
        .verifyEmail(actionCode)
        .pipe(
          first(),
          catchError(error => {
            this.routerService.toInvalidAuthLink(mode);
            throw error;
          }),
          concatMap(() => this.routerService.toSignIn()),
        )
        .subscribe();
    } else {
      this.routerService.to404();
    }
  }
}
