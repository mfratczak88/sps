import { Component, OnInit } from '@angular/core';

import { concatMap, first } from 'rxjs';
import { AuthTranslationKeys } from '../../core/translation-keys';
import { Store } from '@ngxs/store';
import { previousActivationGuidQueryParam } from '../../core/store/routing/routing.selector';
import { AuthActions } from '../../core/store/actions/auth.actions';

@Component({
  selector: 'sps-resend-account-activation',
  templateUrl: './resend-account-activation.component.html',
  styleUrls: ['./resend-account-activation.component.scss'],
})
export class ResendAccountActivationComponent implements OnInit {
  private previousActivationGuid = '';

  readonly translations = AuthTranslationKeys;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.previousActivationGuid = this.store.selectSnapshot(
      previousActivationGuidQueryParam,
    );
    if (!this.previousActivationGuid) {
      this.store.dispatch(new AuthActions.NavigateToNotFound());
    }
  }

  resendActivationLink() {
    this.store
      .dispatch(new AuthActions.ResendActionLink(this.previousActivationGuid))
      .pipe(
        first(),
        concatMap(() =>
          this.store.dispatch(new AuthActions.NavigateToSignIn()),
        ),
      )
      .subscribe();
  }
}
