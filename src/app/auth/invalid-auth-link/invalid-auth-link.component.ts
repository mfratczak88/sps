import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../core/state/router/router.service';
import { AuthActionMode } from '../../core/state/auth/auth.model';
import { AuthTranslationKeys } from '../../core/translation-keys';
import { RouterQuery } from '../../core/state/router/router.query';

@Component({
  selector: 'sps-invalid-auth-link',
  templateUrl: './invalid-auth-link.component.html',
  styleUrls: ['./invalid-auth-link.component.scss'],
})
export class InvalidAuthLinkComponent implements OnInit {
  mode: AuthActionMode;

  readonly translations = AuthTranslationKeys;

  constructor(
    readonly routerService: RouterService,
    private readonly routerQuery: RouterQuery,
  ) {}

  ngOnInit() {
    const mode = this.routerQuery.authActionModeParam();
    if (
      !mode ||
      !Object.values(AuthActionMode).includes(
        (mode as unknown) as AuthActionMode,
      )
    ) {
      this.routerService.to404();
    } else {
      this.mode = mode as AuthActionMode;
    }
  }
}
