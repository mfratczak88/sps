import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../core/service/navigation.service';
import { AuthActionMode } from '../../core/state/auth/auth.model';

@Component({
  selector: 'sps-invalid-auth-link',
  templateUrl: './invalid-auth-link.component.html',
  styleUrls: ['./invalid-auth-link.component.scss'],
})
export class InvalidAuthLinkComponent implements OnInit {
  mode: AuthActionMode;

  constructor(readonly navigationService: NavigationService) {}

  ngOnInit() {
    const mode = this.navigationService.authActionModeFromQueryParams();
    if (!mode || !(mode in AuthActionMode)) {
      this.navigationService.to404();
    } else {
      this.mode = mode as AuthActionMode;
    }
  }
}
