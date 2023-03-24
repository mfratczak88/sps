import { Id } from 'src/app/core/model/common.model';
import { RoleToTranslationKey, User } from '../../../core/model/user.model';
import { Action, State, StateContext } from '@ngxs/store';
import { UserApi } from '../../../core/api/user.api';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import { concatMap, tap } from 'rxjs';
import { mapToObjectWithIds } from '../../../core/util';
import { map } from 'rxjs/operators';
import ChangeUserRole = AdminActions.ChangeUserRole;
import { Role } from '../../../core/model/auth.model';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { UiActions } from '../../../core/store/actions/ui.actions';
import { ToastKeys } from '../../../core/translation-keys';

export interface UsersStateModel {
  entities: {
    [id: Id]: User;
  };
  roles: {
    role: Role;
    translation: string;
  }[];
  loading: boolean;
}
export const defaults: UsersStateModel = {
  entities: {},
  roles: [],
  loading: false,
};

@State<UsersStateModel>({
  name: 'users',
  defaults,
})
@Injectable()
export class UsersState {
  constructor(
    private readonly api: UserApi,
    private readonly translationService: TranslateService,
  ) {}

  @Action(AdminActions.GetAllUsers)
  getAllUsers({ patchState, getState }: StateContext<UsersStateModel>) {
    const { roles } = getState();
    if (!roles.length) {
      patchState({
        roles: Object.values(Role).map((role) => ({
          role,
          translation: this.translationService.instant(
            RoleToTranslationKey[role],
          ),
        })),
      });
    }
    patchState({
      loading: true,
    });
    return this.api.getAll().pipe(
      map((users) =>
        users.map((user) => ({
          ...user,
          roleTranslation: RoleToTranslationKey[user.role],
        })),
      ),
      tap((users) =>
        patchState({
          loading: false,
          entities: mapToObjectWithIds(users),
        }),
      ),
    );
  }

  @Action(AdminActions.ChangeUserRole)
  changeUserRole(
    { dispatch }: StateContext<UsersStateModel>,
    { role, userId }: ChangeUserRole,
  ) {
    return this.api.changeRole(userId, role).pipe(
      tap(() => dispatch(new UiActions.ShowToast(ToastKeys.ROLE_CHANGED))),
      concatMap(() => dispatch(new AdminActions.GetAllUsers())),
    );
  }
}
