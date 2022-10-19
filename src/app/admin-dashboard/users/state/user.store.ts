import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { User } from './user.model';
import { Injectable } from '@angular/core';

export type UserState = EntityState<User, string>;
@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'user',
  idKey: 'uid',
})
export class UserStore extends EntityStore<UserState> {
  constructor() {
    super();
  }
}
