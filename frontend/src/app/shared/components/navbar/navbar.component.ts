import { Component, EventEmitter, Output } from '@angular/core';
import { first } from 'rxjs';
import { SharedKeys } from '../../../core/translation-keys';
import { Store } from '@ngxs/store';
import { isLoggedIn, user } from '../../../core/store/auth/auth.selector';
import { AuthActions } from '../../../core/store/actions/auth.actions';

@Component({
  selector: 'sps-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  user$ = this.store.select(user);

  isLoggedIn$ = this.store.select(isLoggedIn);

  @Output()
  readonly hamburgerPressed = new EventEmitter<void>();

  readonly translations = SharedKeys;

  constructor(private readonly store: Store) {}

  onSignOut() {
    this.store
      .dispatch(new AuthActions.Logout())
      .pipe(first())
      .subscribe(() => window.location.reload());
  }
}
