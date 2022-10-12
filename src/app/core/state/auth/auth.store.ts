import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { User } from './auth.model';

export type AuthState = User | null;

export function createInitialState(): AuthState {
  return {
    displayName: '',
    email: '',
    photoURL: '',
    emailVerified: false,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super(createInitialState());
  }
}
