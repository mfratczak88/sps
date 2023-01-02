import { Component, OnInit } from '@angular/core';
import { catchError, first, NEVER } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse, MessageCode } from '../../core/model/error.model';
import { Store } from '@ngxs/store';
import { activationGuid } from '../../core/store/routing/routing.selector';
import { AuthActions } from '../../core/store/actions/auth.actions';

@Component({
  selector: 'sps-confirm-account',
  template: '',
})
export class ConfirmAccountComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    const guid = this.store.selectSnapshot(activationGuid);
    if (!guid) {
      this.store.dispatch(new AuthActions.NavigateToNotFound());
      return;
    }
    this.store
      .dispatch(new AuthActions.ConfirmRegistration(guid))
      .pipe(
        first(),
        catchError((err: HttpErrorResponse) => {
          if (
            (err.error as ErrorResponse)?.messageCode ===
            MessageCode.URL_NO_LONGER_VALID
          ) {
            this.store.dispatch(
              new AuthActions.NavigateToResendActivationLink(guid),
            );
            return NEVER;
          }
          throw err;
        }),
      )
      .subscribe(() => this.store.dispatch(new AuthActions.NavigateToSignIn()));
  }
}
