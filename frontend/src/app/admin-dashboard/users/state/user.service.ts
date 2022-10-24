import { Injectable } from '@angular/core';
import { UserStore } from './user.store';
import { ToastService } from '../../../core/service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UserApi } from './user.api';
import { concatMap, map, tap } from 'rxjs/operators';
import { Role, RoleToTranslationKey } from './user.model';
import { first } from 'rxjs';
import { ToastKeys } from '../../../core/translation-keys';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly store: UserStore,
    private readonly api: UserApi,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
  ) {
    this.loadUsers().subscribe();
  }

  private loadUsers() {
    return this.api.getAll().pipe(
      first(),
      map(users =>
        users.map(user => ({
          ...user,
          roleTranslation: this.translateService.instant(
            RoleToTranslationKey[user.role],
          ),
        })),
      ),
      tap(users => this.store.set(users)),
    );
  }

  changeRoleFor(userId: string, newRole: Role) {
    return this.api.changeRole(userId, newRole).pipe(
      concatMap(() => this.loadUsers()),
      tap(() =>
        this.toastService.show(
          this.translateService.instant(ToastKeys.ROLE_CHANGED),
        ),
      ),
    );
  }
}
