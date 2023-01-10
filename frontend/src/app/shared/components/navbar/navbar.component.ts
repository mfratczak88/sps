import { Component, EventEmitter, Output } from '@angular/core';
import { first } from 'rxjs';
import { SharedKeys } from '../../../core/translation-keys';
import { Store } from '@ngxs/store';
import { isLoggedIn, user } from '../../../core/store/auth/auth.selector';
import { AuthActions } from '../../../core/store/actions/auth.actions';
import { availableLanguages, lang } from '../../../core/store/ui/ui.selector';
import { UiActions } from '../../../core/store/actions/ui.actions';

@Component({
  selector: 'sps-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  user$ = this.store.select(user);

  isLoggedIn$ = this.store.select(isLoggedIn);

  languages$ = this.store.select(availableLanguages);

  @Output()
  readonly hamburgerPressed = new EventEmitter<void>();

  readonly translations = SharedKeys;

  constructor(private readonly store: Store) {}

  onSignOut() {
    this.store.dispatch(new AuthActions.Logout());
  }

  onChangeLanguage(lang: string) {
    this.store.dispatch(new UiActions.LangChanged(lang));
  }
}
