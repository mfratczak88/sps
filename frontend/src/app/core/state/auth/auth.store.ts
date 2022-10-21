import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { initialStoreState, User } from './auth.model';

export type AuthState = User | null;

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super(initialStoreState);
  }
}
