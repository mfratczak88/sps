import SpyObj = jasmine.SpyObj;
import { UserStore } from './user.store';
import { UserApi } from './user.api';
import { ToastService } from '../../../core/service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';
import { mockUsers } from '../../../../../test/users.util';
import { of } from 'rxjs';
import { Role, RoleToTranslationKey } from './user.model';
import { ToastKeys } from '../../../core/translation-keys';

describe('User service', () => {
  let storeSpy: SpyObj<UserStore>;
  let apiSpy: SpyObj<UserApi>;
  let toastServiceSpy: SpyObj<ToastService>;
  let translateServiceSpy: SpyObj<TranslateService>;
  let userService: UserService;
  beforeEach(() => {
    storeSpy = jasmine.createSpyObj('Store', ['set']);
    apiSpy = jasmine.createSpyObj('Api', ['getAll', 'changeRole']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    translateServiceSpy = jasmine.createSpyObj('Translate service', [
      'instant',
    ]);
  });
  it('Loads users on construct and provides them to the store with translations', () => {
    const [user] = mockUsers;
    apiSpy.getAll.and.returnValue(of([user]));
    translateServiceSpy.instant.and.returnValue('driver');
    userService = new UserService(
      storeSpy,
      apiSpy,
      toastServiceSpy,
      translateServiceSpy,
    );
    expect(apiSpy.getAll).toHaveBeenCalled();
    expect(translateServiceSpy.instant).toHaveBeenCalledWith(
      RoleToTranslationKey[user.role],
    );
    expect(storeSpy.set).toHaveBeenCalledWith([
      {
        ...user,
        roleTranslation: 'driver',
      },
    ]);
  });
  it('Changes user role, reloads the store and shows toast', () => {
    apiSpy.getAll.and.returnValue(of(mockUsers));
    userService = new UserService(
      storeSpy,
      apiSpy,
      toastServiceSpy,
      translateServiceSpy,
    );
    const [user] = mockUsers;
    const newRole = Role.ADMIN;
    apiSpy.changeRole.and.returnValue(of(undefined));

    userService.changeRoleFor(user.id, newRole).subscribe();

    expect(apiSpy.changeRole).toHaveBeenCalledWith(user.id, newRole);
    expect(apiSpy.getAll).toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalledWith(ToastKeys.ROLE_CHANGED);
  });
});
