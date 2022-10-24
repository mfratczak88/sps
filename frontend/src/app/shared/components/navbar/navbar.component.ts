import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../core/state/auth/auth.service';
import { User } from '../../../core/state/auth/auth.model';
import { first, Observable } from 'rxjs';
import { RouterService } from '../../../core/state/router/router.service';
import { AuthQuery } from '../../../core/state/auth/auth.query';
import { SharedKeys } from '../../../core/translation-keys';

@Component({
  selector: 'sps-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  user$: Observable<User | null>;

  @Output()
  readonly hamburgerPressed = new EventEmitter<void>();

  readonly translations = SharedKeys;

  constructor(
    readonly authQuery: AuthQuery,
    readonly authService: AuthService,
    readonly navigationService: RouterService,
  ) {
    this.user$ = this.authQuery.select();
  }

  onSignOut() {
    this.authService
      .logout()
      .pipe(first())
      .subscribe(() => this.navigationService.reload());
  }
}
