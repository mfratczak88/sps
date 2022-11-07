import { Injectable } from '@angular/core';
import { UserState, UserStore } from './user.store';
import { QueryEntity } from '@datorama/akita';
import { TranslateService } from '@ngx-translate/core';
import { Role, RoleToTranslationKey, RoleWithTranslation } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserQuery extends QueryEntity<UserState> {
  roles(): RoleWithTranslation[] {
    return Object.values(Role).map(value => ({
      role: value,
      translation: this.translateService.instant(RoleToTranslationKey[value]),
    }));
  }

  constructor(
    store: UserStore,
    private readonly translateService: TranslateService,
  ) {
    super(store);
  }
}
