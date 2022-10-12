import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../core/service/navigation.service';
import { AuthActionMode } from '../../core/state/auth/auth.model';
import { AuthTranslationKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-invalid-auth-link',
  templateUrl: './invalid-auth-link.component.html',
  styleUrls: ['./invalid-auth-link.component.scss'],
})
export class InvalidAuthLinkComponent implements OnInit {
  mode: AuthActionMode;

  readonly translations = AuthTranslationKeys;

  constructor(readonly navigationService: NavigationService) {}

  ngOnInit() {
    const mode = this.navigationService.authActionModeFromQueryParams();
    if (
      !mode ||
      !Object.values(AuthActionMode).includes(
        (mode as unknown) as AuthActionMode,
      )
    ) {
      this.navigationService.to404();
    } else {
      this.mode = mode as AuthActionMode;
    }
  }
}
