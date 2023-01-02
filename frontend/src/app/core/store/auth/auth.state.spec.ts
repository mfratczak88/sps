import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { AuthApi } from '../../api/auth.api';
import { AuthState, AuthStateModel, defaults } from './auth.state';
import { StateContext } from '@ngxs/store';
import { AuthActions } from '../actions/auth.actions';
import { lastValueFrom, of, throwError } from 'rxjs';
import { UiActions } from '../actions/ui.actions';
import { ToastKeys } from '../../translation-keys';
import { AuthUser, Role } from '../../model/auth.model';
import { newContextSpy } from '../../../../../test/spy.util';
import SpyObj = jasmine.SpyObj;

describe('Auth state', () => {
  let socialAuthServiceMock: SpyObj<SocialAuthService>;
  let authApi: SpyObj<AuthApi>;
  let authState: AuthState;
  let contextMock: SpyObj<StateContext<AuthStateModel>>;
  const userFromLocalStorage = () => {
    const stringifyUser = localStorage.getItem('user');
    return stringifyUser && JSON.parse(stringifyUser);
  };
  const mockUser: AuthUser = {
    name: 'Maciek',
    email: 'mfratczak88@gmail.com',
    id: '3',
    validToISO: new Date().toISOString(),
    authExpiresIn: '900s',
    role: Role.DRIVER,
  };
  beforeEach(() => {
    socialAuthServiceMock = jasmine.createSpyObj('SocialAuthUser', ['signIn']);
    contextMock = newContextSpy();
    authApi = jasmine.createSpyObj('AuthApi', [
      'login',
      'loginWithGoogle',
      'register',
      'confirmRegistration',
      'refreshToken',
      'logout',
      'resendActivationLink',
      'changePassword',
      'restoreAuth',
    ]);
    authState = new AuthState(authApi, socialAuthServiceMock);
    localStorage.clear();
  });

  it('Calls api on login and sets user to local storage', async () => {
    authApi.login.and.returnValue(of(mockUser));
    const action = new AuthActions.Login('email', 'pass');

    await lastValueFrom(authState.login(contextMock, action));

    expect(authApi.login).toHaveBeenCalledWith('email', 'pass');
    expect(contextMock.setState).toHaveBeenCalledWith({
      ...mockUser,
      loading: false,
    });
    expect(userFromLocalStorage()).toEqual(mockUser);
  });
  it('Calls api on register and shows toast', async () => {
    const action = new AuthActions.Register('Mike', 'email', 'pass');
    authApi.register.and.returnValue(of(undefined));
    contextMock.dispatch.and.returnValue(of(undefined));
    await lastValueFrom(authState.register(contextMock, action));

    expect(authApi.register).toHaveBeenCalledWith(action);
    expect(contextMock.dispatch).toHaveBeenCalledWith(
      new UiActions.ShowToast(ToastKeys.CHECK_EMAIL),
    );
  });

  it('Calls api on refreshToken and sets state', async () => {
    authApi.refreshToken.and.returnValue(of(mockUser));

    await lastValueFrom(authState.refreshToken(contextMock));

    expect(authApi.refreshToken).toHaveBeenCalled();
    expect(contextMock.patchState).toHaveBeenCalledWith({
      ...mockUser,
      loading: false,
    });
    expect(userFromLocalStorage()).toEqual(mockUser);
  });
  it('Calls api on login with google and sets state', async () => {
    socialAuthServiceMock.signIn.and.resolveTo({
      idToken: '1',
      email: 'email',
    } as SocialUser);
    authApi.loginWithGoogle.and.returnValue(of(mockUser));

    await lastValueFrom(authState.loginWithGoogle(contextMock));

    expect(socialAuthServiceMock.signIn).toHaveBeenCalledWith(
      GoogleLoginProvider.PROVIDER_ID,
    );
    expect(authApi.loginWithGoogle).toHaveBeenCalledWith('1', 'email');
    expect(contextMock.patchState).toHaveBeenCalledWith({
      ...mockUser,
      loading: false,
    });
    expect(userFromLocalStorage()).toEqual(mockUser);
  });
  it('Calls api on logout and sets state to defaults', async () => {
    authApi.logout.and.returnValue(of({}));

    await lastValueFrom(authState.logout(contextMock));

    expect(authApi.logout).toHaveBeenCalled();
    expect(contextMock.setState).toHaveBeenCalledWith(defaults);
    expect(userFromLocalStorage()).toBeFalsy();
  });
  it('Calls api on confirm registration and dispatches show toast', async () => {
    const action = new AuthActions.ConfirmRegistration('1');
    authApi.confirmRegistration.and.returnValue(of({}));
    contextMock.dispatch.and.returnValue(of(undefined));

    await lastValueFrom(authState.confirmRegistration(contextMock, action));

    expect(authApi.confirmRegistration).toHaveBeenCalledWith('1');
    expect(contextMock.dispatch).toHaveBeenCalledWith(
      new UiActions.ShowToast(ToastKeys.EMAIL_VERIFIED),
    );
  });
  it('Calls api on resend activation link and dispatches show toast', async () => {
    const action = new AuthActions.ResendActionLink('1');
    authApi.resendActivationLink.and.returnValue(of(undefined));
    contextMock.dispatch.and.returnValue(of(undefined));

    await lastValueFrom(authState.resendActivationLink(contextMock, action));

    expect(authApi.resendActivationLink).toHaveBeenCalledWith('1');
    expect(contextMock.dispatch).toHaveBeenCalledWith(
      new UiActions.ShowToast(ToastKeys.CHECK_EMAIL),
    );
  });
  it('Calls api on change password and dispatches show toast', async () => {
    const action = new AuthActions.ChangePassword('old', 'new');
    contextMock.dispatch.and.returnValue(of(undefined));
    authApi.changePassword.and.returnValue(of(undefined));

    await lastValueFrom(authState.changePassword(contextMock, action));

    expect(authApi.changePassword).toHaveBeenCalledWith('old', 'new');
    expect(contextMock.dispatch).toHaveBeenCalledWith(
      new UiActions.ShowToast(ToastKeys.PASSWORD_CHANGED),
    );
  });
  describe('Restore auth', () => {
    it('sets state from local storage if token has not expired', async () => {
      const user = { ...mockUser, validToISO: '2028-12-12 10:00:00' };
      localStorage.setItem('user', JSON.stringify(user));
      await authState.restoreAuth(contextMock);
      expect(contextMock.patchState).toHaveBeenCalledWith({
        ...user,
        loading: false,
      });
    });
    it('sets default value if user was not in local storage', async () => {
      authApi.refreshToken.and.returnValue(throwError(() => new Error('foo')));
      localStorage.clear();
      await authState.restoreAuth(contextMock);
      expect(contextMock.patchState).toHaveBeenCalledWith(defaults);
    });
    it('if user token has expired sets state from response of api call', async () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      authApi.refreshToken.and.returnValue(of(mockUser));

      await authState.restoreAuth(contextMock);

      expect(contextMock.patchState).toHaveBeenCalledWith({
        ...mockUser,
        loading: false,
      });
    });
  });
});
