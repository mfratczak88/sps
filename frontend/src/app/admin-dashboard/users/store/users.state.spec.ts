import { StateContext } from '@ngxs/store';
import { UserApi } from '../../../core/api/user.api';
import { TranslateService } from '@ngx-translate/core';
import { newContextSpy } from '../../../../../test/spy.util';
import { UsersState, UsersStateModel } from './users.state';
import { lastValueFrom, NEVER, of } from 'rxjs';
import { Role } from '../../../core/model/auth.model';
import { mockUsers } from '../../../../../test/users.util';
import { mapToObjectWithIds } from '../../../core/util';
import { UiActions } from '../../../core/store/actions/ui.actions';
import { ToastKeys } from '../../../core/translation-keys';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import SpyObj = jasmine.SpyObj;
import { RoleToTranslationKey } from '../../../core/model/user.model';

describe('Users state', () => {
  let contextMock: SpyObj<StateContext<UsersStateModel>>;
  let apiMock: SpyObj<UserApi>;
  let translationsServiceMock: SpyObj<TranslateService>;
  let usersState: UsersState;
  beforeEach(() => {
    contextMock = newContextSpy();
    apiMock = jasmine.createSpyObj('UserApi', ['getAll', 'changeRole']);
    translationsServiceMock = jasmine.createSpyObj('TranslateService', [
      'instant',
    ]);
    usersState = new UsersState(apiMock, translationsServiceMock);
  });
  describe('Get all users', () => {
    it('when roles are not set yet it sets them with translations', async () => {
      contextMock.getState.and.returnValue({
        loading: false,
        roles: [],
        entities: {},
      });
      apiMock.getAll.and.returnValue(NEVER);
      translationsServiceMock.instant.and.returnValue('t');
      usersState.getAllUsers(contextMock);

      expect(contextMock.patchState).toHaveBeenCalledWith({
        roles: Object.values(Role).map((role) => ({ role, translation: 't' })),
      });
    });
    it('calls api and sets state', async () => {
      contextMock.getState.and.returnValue({
        loading: false,
        roles: [{ role: Role.DRIVER, translation: 'driver' }],
        entities: {},
      });
      apiMock.getAll.and.returnValue(of(mockUsers));

      await lastValueFrom(usersState.getAllUsers(contextMock));

      expect(apiMock.getAll).toHaveBeenCalled();
      expect(contextMock.patchState.calls.argsFor(0)).toEqual([
        {
          loading: true,
        },
      ]);
      expect(contextMock.patchState.calls.argsFor(1)).toEqual([
        {
          loading: false,
          entities: mapToObjectWithIds(
            mockUsers.map((user) => ({
              ...user,
              roleTranslation: RoleToTranslationKey[user.role],
            })),
          ),
        },
      ]);
    });
  });
  describe('Change role', () => {
    it('calls api and dispatches actions: ShowToast and GetAllUsers', async () => {
      const userId = '1';
      apiMock.changeRole.and.returnValue(of(undefined));
      contextMock.dispatch.and.returnValues(of(undefined), of(undefined));

      await lastValueFrom(
        usersState.changeUserRole(contextMock, { role: Role.DRIVER, userId }),
      );

      expect(apiMock.changeRole).toHaveBeenCalledWith(userId, Role.DRIVER);
      expect(contextMock.dispatch).toHaveBeenCalledWith(
        new UiActions.ShowToast(ToastKeys.ROLE_CHANGED),
      );
      expect(contextMock.dispatch).toHaveBeenCalledWith(
        new AdminActions.GetAllUsers(),
      );
    });
  });
});
