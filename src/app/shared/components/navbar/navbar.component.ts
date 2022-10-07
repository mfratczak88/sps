import { Component } from '@angular/core';
import { AuthService } from '../../../core/state/auth/auth.service';
import { User } from '../../../core/state/auth/auth.model';
import { Observable } from 'rxjs';
import { NavigationService } from '../../../core/service/navigation.service';
import { AuthQuery } from '../../../core/state/auth/auth.query';

@Component({
  selector: 'sps-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  user$: Observable<User | null>;

  constructor(
    readonly authQuery: AuthQuery,
    readonly authService: AuthService,
    readonly navigationService: NavigationService,
  ) {
    this.user$ = this.authQuery.select();
  }

  onSignOut() {
    this.authService.signOut().then(() => this.navigationService.toRoot());
  }
}
