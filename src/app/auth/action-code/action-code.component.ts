import { Component } from '@angular/core';
import { AuthService } from '../../core/state/auth/auth.service';
import { NavigationService } from '../../core/service/navigation.service';
import { catchError, concatMap, first } from 'rxjs';
import { AuthActionMode } from '../../core/state/auth/auth.model';

@Component({
  selector: 'sps-action-code',
  template: '',
})
export class ActionCodeComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly navigationService: NavigationService,
  ) {}

  ngOnInit(): void {
    const {
      oobCode,
      mode,
    } = this.navigationService.actionCodeParamsFromActivatedRoute();
    if (!oobCode) {
      this.navigationService.to404();
      return;
    }
    if (mode === AuthActionMode.VERIFY_EMAIL) {
      this.authService
        .verifyEmail(oobCode)
        .pipe(
          first(),
          catchError(error => {
            this.navigationService.toInvalidAuthLink(mode);
            throw error;
          }),
          concatMap(() => this.navigationService.toSignIn()),
        )
        .subscribe();
    } else {
      this.navigationService.to404();
    }
  }
}
