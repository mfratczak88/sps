import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AuthStore, AuthState } from './auth.store';
import { Observable } from 'rxjs';
import { initialStoreState, User } from './auth.model';
import equal from 'fast-deep-equal';
@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<AuthState> {
  isLoggedIn$: Observable<boolean> = this.select(user =>
    this.nonEmptyAuth(user),
  );

  loggedIn() {
    return this.nonEmptyAuth(this.getValue());
  }

  constructor(store: AuthStore) {
    super(store);
  }

  private nonEmptyAuth(user: User | null) {
    return !!user && !equal(user, initialStoreState);
  }
}
