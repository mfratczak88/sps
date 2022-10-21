import { AuthService } from './auth.service';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import SpyObj = jasmine.SpyObj;
import { AuthApi } from './auth.api';
import { initialStoreState, RegisterUserPayload, User } from './auth.model';
import { of } from 'rxjs';
import { AuthStore } from './auth.store';
import { ToastService } from '../../service/toast.service';

describe('Auth service', () => {
  let authService: AuthService;
  let socialAuthServiceMock: SpyObj<SocialAuthService>;
  let authApi: SpyObj<AuthApi>;
  let authStoreSpy: SpyObj<AuthStore>;
  let toastServiceSpy: SpyObj<ToastService>;
  const userFromLocalStorage = () => {
    const stringifyUser = localStorage.getItem('user');
    return stringifyUser && JSON.parse(stringifyUser);
  };
  beforeEach(() => {
    socialAuthServiceMock = jasmine.createSpyObj('SocialAuthUser', ['signIn']);
    authApi = jasmine.createSpyObj('AuthApi', [
      'login',
      'loginWithGoogle',
      'register',
      'confirmRegistration',
      'refreshToken',
      'logout',
      'resendActivationLink',
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    authStoreSpy = jasmine.createSpyObj('AuthStore', ['_setState']);
    localStorage.clear();
    authService = new AuthService(
      authApi,
      socialAuthServiceMock,
      authStoreSpy,
      toastServiceSpy,
    );
  });

  it('Sets user session on successful login from auth api and sets the value to the store', () => {
    // given
    const user: User = {
      name: 'Maciek',
      email: 'mfratczak88@gmail.com',
      id: '3',
      validToISO: new Date().toISOString(),
      authExpiresIn: '900s',
    };
    const password = '444fdsad33/23@#';

    authApi.login.and.returnValue(of(user));

    // when
    authService.login(user.email, password).subscribe(result => {
      //then
      expect(result).toEqual(user);
      expect(userFromLocalStorage()).toEqual(user);
      expect(authApi.login.calls.mostRecent().args[0]).toEqual(user.email);
      expect(authApi.login.calls.mostRecent().args[1]).toEqual(password);
      expect(authStoreSpy._setState).toHaveBeenCalledWith(user);
    });
  });

  it('Delegates the register call to the api', () => {
    authApi.register.and.returnValue(of(void 0));
    const registerPayload: RegisterUserPayload = {
      name: 'Bolek',
      email: 'lech.walesa@gmail.com',
      password: 'MaPanDowod?2137',
    };
    authService.register(registerPayload);
    expect(authApi.register).toHaveBeenCalledWith(registerPayload);
    expect(authApi.register).toHaveBeenCalledTimes(1);
  });
  it('Calls api on refresh token and sets user session based on that', () => {
    const userResponse: User = {
      name: 'Lech Walesa',
      email: 'bolek@sb.gov.pl',
      id: '2137',
      validToISO: new Date().toISOString(),
      authExpiresIn: '900s',
    };
    authApi.refreshToken.and.returnValue(of(userResponse));
    authService.refreshToken().subscribe(res => {
      expect(res).toEqual(userResponse);
      expect(authApi.refreshToken).toHaveBeenCalledTimes(1);
      expect(authStoreSpy._setState).toHaveBeenCalledWith(userResponse);
      expect(userResponse).toEqual(userFromLocalStorage());
    });
  });
  it('Forwards data from google sign in to the api and sets user session', done => {
    const googleSignInResult: Partial<SocialUser> = {
      name: 'Czesław',
      id: '331',
      idToken: '33323',
      email: 'czeslaw.kiszczak@gmail.com',
      firstName: 'Czesław',
      lastName: 'Kiszczak',
    };
    socialAuthServiceMock.signIn.and.resolveTo(
      googleSignInResult as SocialUser,
    );
    const user: User = {
      name: 'Czesław',
      id: '442',
      email: googleSignInResult.email!,
      validToISO: new Date().toISOString(),
      authExpiresIn: '900s',
    };

    authApi.loginWithGoogle.and.returnValue(of(user));

    authService.loginWithGoogle().subscribe(response => {
      expect(response).toEqual(user);
      expect(socialAuthServiceMock.signIn).toHaveBeenCalledWith(
        GoogleLoginProvider.PROVIDER_ID,
      );
      expect(authApi.loginWithGoogle).toHaveBeenCalledWith(
        googleSignInResult.idToken!,
        googleSignInResult.email!,
      );

      expect(authStoreSpy._setState).toHaveBeenCalledWith(user);
      done();
    });
  });
  it('Calls api on logout and clears local storage', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        name: 'Alex',
        id: '333234123',
        email: 'alex@gmail.com',
        validToISO: new Date().toISOString(),
        authExpiresIn: '900s',
      }),
    );

    authApi.logout.and.returnValue(of({ undefined }));
    authService.logout().subscribe(() => {
      expect(authApi.logout).toHaveBeenCalledTimes(1);
      expect(authStoreSpy._setState).toHaveBeenCalledWith(initialStoreState);
      expect(localStorage.getItem('user')).toBeFalsy();
    });
  });

  it('Delegates call for confirm registration to api', () => {
    authApi.confirmRegistration.and.returnValue(of(undefined));
    authService.confirmRegistration('3');
    expect(authApi.confirmRegistration).toHaveBeenCalledWith('3');
  });
  it('Delegates call for resend activation link to api', () => {
    authApi.resendActivationLink.and.returnValue(of(undefined));
    authService.resendActivationLink('4');
    expect(authApi.resendActivationLink).toHaveBeenCalledWith('4');
  });
  it('Calls refresh when user has been logged in before but token expired', async () => {
    const validToInThePast = new Date();
    const validToISO = new Date().toISOString();
    new Date().setHours(validToInThePast.getHours() - 48);
    const user: User = {
      name: 'Michelle',
      id: '44',
      email: 'michelle@gmail.com',
      validToISO: validToInThePast.toISOString(),
      authExpiresIn: '900s',
    };
    const userWithUpdatedToken: User = {
      ...user,
      validToISO,
    };

    localStorage.setItem('user', JSON.stringify(user));
    authApi.refreshToken.and.returnValue(of(userWithUpdatedToken));
    await authService.restoreAuth();
    expect(userFromLocalStorage()).toEqual(userWithUpdatedToken);
    expect(authStoreSpy._setState).toHaveBeenCalledWith(userWithUpdatedToken);
  });
  it('If user does not exist in local storage it sets empty value to the store', async () => {
    await authService.restoreAuth();
    expect(userFromLocalStorage()).toBeFalsy();
    expect(authStoreSpy._setState).toHaveBeenCalledWith(null);
  });
  it('If user exists and token has not expired it sets user to the store as is from local storage', () => {
    const validDate = new Date();
    validDate.setHours(validDate.getHours() + 48);

    const user: User = {
      name: 'Mike',
      id: '34234',
      email: 'mike@gmail.com',
      validToISO: validDate.toISOString(),
      authExpiresIn: '900s',
    };
    localStorage.setItem('user', JSON.stringify(user));
    authService.restoreAuth();
    expect(authStoreSpy._setState).toHaveBeenCalledWith(user);
  });
});
