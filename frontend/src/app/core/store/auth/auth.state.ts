import { AuthApi } from '../../api/auth.api';
import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AuthActions } from '../actions/auth.actions';
import { mergeMap, tap } from 'rxjs/operators';
import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { concatMap, finalize, first, from, lastValueFrom, of } from 'rxjs';
import { UiActions } from '../actions/ui.actions';
import { ToastKeys } from '../../translation-keys';
import { AuthUser, Role } from '../../model/auth.model';
import { Navigate } from '@ngxs/router-plugin';

export interface AuthStateModel {
  id: string;
  name: string;
  email: string;
  validToISO?: string;
  authExpiresIn: string;
  role: Role | string;
  loading: boolean;
}
export const defaults: AuthStateModel = {
  email: '',
  id: '',
  validToISO: '',
  name: '',
  authExpiresIn: '',
  role: '',
  loading: false,
};

@State<AuthStateModel>({
  name: 'auth',
  defaults,
})
@Injectable({
  providedIn: 'root',
})
export class AuthState {
  constructor(
    private readonly api: AuthApi,
    private readonly socialAuthService: SocialAuthService,
  ) {}

  @Action(AuthActions.Login)
  login(
    { setState, patchState }: StateContext<AuthStateModel>,
    { email, password }: AuthActions.Login,
  ) {
    patchState({
      loading: true,
    });
    return this.api.login(email, password).pipe(
      tap(user => {
        setState({
          ...user,
          loading: false,
        });
        AuthState.userToLocalStorage(user);
      }),
    );
  }

  @Action(AuthActions.Register)
  register(
    { dispatch }: StateContext<AuthStateModel>,
    action: AuthActions.Register,
  ) {
    return this.api
      .register(action)
      .pipe(
        mergeMap(() =>
          dispatch(new UiActions.ShowToast(ToastKeys.CHECK_EMAIL)),
        ),
      );
  }

  @Action(AuthActions.RefreshToken)
  refreshToken({ patchState }: StateContext<AuthStateModel>) {
    patchState({ loading: true });
    return this.api.refreshToken().pipe(
      tap(result => {
        patchState({ ...result, loading: false });
        AuthState.userToLocalStorage(result);
      }),
    );
  }

  @Action(AuthActions.LoginWithGoogle)
  loginWithGoogle({ patchState }: StateContext<AuthStateModel>) {
    patchState({ loading: true });
    return from(
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID),
    ).pipe(
      concatMap(({ idToken, email }) =>
        this.api.loginWithGoogle(idToken, email),
      ),
      tap(user => {
        patchState({ ...user, loading: false });
        AuthState.userToLocalStorage(user);
      }),
    );
  }

  @Action(AuthActions.Logout)
  logout({ setState, dispatch }: StateContext<AuthStateModel>) {
    AuthState.removeUserInfoFromLocalStorage();
    return this.api.logout().pipe(
      first(),
      finalize(() => {
        setState(defaults);
        return dispatch(new Navigate(['/']));
      }),
    );
  }

  @Action(AuthActions.ConfirmRegistration)
  confirmRegistration(
    { dispatch }: StateContext<AuthStateModel>,
    { id }: AuthActions.ConfirmRegistration,
  ) {
    return this.api
      .confirmRegistration(id)
      .pipe(
        mergeMap(() =>
          dispatch(new UiActions.ShowToast(ToastKeys.EMAIL_VERIFIED)),
        ),
      );
  }

  @Action(AuthActions.ResendActionLink)
  resendActivationLink(
    { dispatch }: StateContext<AuthStateModel>,
    { previousGuid }: AuthActions.ResendActionLink,
  ) {
    return this.api
      .resendActivationLink(previousGuid)
      .pipe(
        mergeMap(() =>
          dispatch(new UiActions.ShowToast(ToastKeys.CHECK_EMAIL)),
        ),
      );
  }

  @Action(AuthActions.ChangePassword)
  changePassword(
    { dispatch }: StateContext<AuthStateModel>,
    { oldPassword, newPassword }: AuthActions.ChangePassword,
  ) {
    return this.api
      .changePassword(oldPassword, newPassword)
      .pipe(
        mergeMap(() =>
          dispatch(new UiActions.ShowToast(ToastKeys.PASSWORD_CHANGED)),
        ),
      );
  }

  @Action(AuthActions.RestoreAuth)
  async restoreAuth({ patchState }: StateContext<AuthStateModel>) {
    patchState({ loading: true });
    let user = AuthState.userFromLocalStorage();
    if (user && AuthState.tokenExpired()) {
      try {
        user = await lastValueFrom(this.api.refreshToken());
      } catch (err) {
        AuthState.removeUserInfoFromLocalStorage();
        patchState(defaults);
        return;
      }
    }
    patchState({ ...user, loading: false });
    user && AuthState.userToLocalStorage(user);
  }

  private static tokenExpired() {
    const { validToISO }: AuthUser = AuthState.userFromLocalStorage();

    return !validToISO || new Date() > new Date(validToISO);
  }

  private static userToLocalStorage(user: AuthUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private static userFromLocalStorage() {
    const userString = localStorage.getItem('user');
    return (userString && JSON.parse(userString)) || defaults;
  }

  private static removeUserInfoFromLocalStorage() {
    localStorage.removeItem('user');
  }
}
