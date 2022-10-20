import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AuthStore, AuthState } from './auth.store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<AuthState> {
  isLoggedIn$: Observable<boolean> = this.select(user => {
    return !!user && user.emailVerified;
  });

  constructor(store: AuthStore) {
    super(store);
  }
}
