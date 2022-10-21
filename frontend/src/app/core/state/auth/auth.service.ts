import { Injectable } from '@angular/core';
import {
  catchError,
  concatMap,
  EMPTY,
  first,
  from,
  lastValueFrom,
  Observable,
} from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { initialStoreState, RegisterUserPayload, User } from './auth.model';
import { AuthApi } from './auth.api';
import { AuthStore } from './auth.store';
import { ToastService } from '../../service/toast.service';
import { ToastKeys } from '../../translation-keys';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly authApi: AuthApi,
    private socialAuthService: SocialAuthService,
    private readonly authStore: AuthStore,
    private readonly toastService: ToastService,
  ) {
    this.restoreAuth();
  }

  login(email: string, password: string): Observable<User> {
    return this.authApi.login(email, password).pipe(
      tap(result => {
        this.setUserSession(result);
      }),
    );
  }

  register(command: RegisterUserPayload): Observable<User> {
    return this.authApi
      .register(command)
      .pipe(tap(() => this.toastService.show(ToastKeys.CHECK_EMAIL)));
  }

  refreshToken() {
    return this.authApi
      .refreshToken()
      .pipe(tap(result => this.setUserSession(result)));
  }

  loginWithGoogle() {
    return from(
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID),
    ).pipe(
      concatMap(({ idToken, email }) =>
        this.authApi.loginWithGoogle(idToken, email),
      ),
      tap(user => {
        this.setUserSession(user);
      }),
    );
  }

  logout() {
    AuthService.removeUserInfoFromLocalStorage();
    return this.authApi.logout().pipe(
      first(),
      tap(() => {
        this.authStore.update(() => initialStoreState);
      }),
    );
  }

  confirmRegistration(id: string): Observable<any> {
    return this.authApi.confirmRegistration(id);
  }

  resendActivationLink(previousGuid: string) {
    return this.authApi.resendActivationLink(previousGuid);
  }

  private static removeUserInfoFromLocalStorage() {
    localStorage.removeItem('user');
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.authApi.changePassword(oldPassword, newPassword);
  }

  async restoreAuth() {
    let user = AuthService.userFromLocalStorage();
    if (user && AuthService.tokenExpired()) {
      AuthService.removeUserInfoFromLocalStorage();
      user = await lastValueFrom(
        this.refreshToken().pipe(
          catchError(() => {
            AuthService.removeUserInfoFromLocalStorage();
            return EMPTY;
          }),
        ),
      );
      this.setUserSession(user);
    }
    this.setUserSession(user);
    return user;
  }

  private static tokenExpired() {
    const { validToISO }: User = AuthService.userFromLocalStorage();

    return !validToISO || new Date() > new Date(validToISO);
  }

  private static userToLocalStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private static userFromLocalStorage() {
    const userString = localStorage.getItem('user');
    return userString && JSON.parse(userString);
  }

  private setUserSession(user: User) {
    AuthService.userToLocalStorage(user);
    this.authStore._setState(user);
  }
}
