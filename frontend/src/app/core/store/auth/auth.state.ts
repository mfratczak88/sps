import { AuthApi } from '../../api/auth.api';
import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AuthActions } from '../actions/auth.actions';
import { mergeMap, tap } from 'rxjs/operators';
import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { catchError, concatMap, EMPTY, first, from, lastValueFrom } from 'rxjs';
import { UiActions } from '../actions/ui.actions';
import { ToastKeys } from '../../translation-keys';
import { Role, User } from '../../model/auth.model';

export interface AuthStateModel {
  id: string;
  name: string;
  email: string;
  validToISO?: string;
  authExpiresIn: string;
  role: Role | string;
}
export const defaults: AuthStateModel = {
  email: '',
  id: '',
  validToISO: '',
  name: '',
  authExpiresIn: '',
  role: '',
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
    { setState }: StateContext<AuthStateModel>,
    { email, password }: AuthActions.Login,
  ) {
    return this.api.login(email, password).pipe(
      tap(user => {
        setState({
          ...user,
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
  refreshToken({ setState }: StateContext<AuthStateModel>) {
    return this.api.refreshToken().pipe(
      tap(result => {
        setState({ ...result });
        AuthState.userToLocalStorage(result);
      }),
    );
  }

  @Action(AuthActions.LoginWithGoogle)
  loginWithGoogle({ setState }: StateContext<AuthStateModel>) {
    return from(
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID),
    ).pipe(
      concatMap(({ idToken, email }) =>
        this.api.loginWithGoogle(idToken, email),
      ),
      tap(user => {
        setState({ ...user });
        AuthState.userToLocalStorage(user);
      }),
    );
  }

  @Action(AuthActions.Logout)
  logout({ setState }: StateContext<AuthStateModel>) {
    AuthState.removeUserInfoFromLocalStorage();
    return this.api.logout().pipe(
      first(),
      tap(() => setState(defaults)),
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
  async restoreAuth({ setState }: StateContext<AuthStateModel>) {
    let user = AuthState.userFromLocalStorage();
    if (user && AuthState.tokenExpired()) {
      user = await lastValueFrom(
        this.api.refreshToken().pipe(
          catchError(() => {
            AuthState.removeUserInfoFromLocalStorage();
            return EMPTY;
          }),
        ),
      );
    }
    setState(user);
  }

  private static tokenExpired() {
    const { validToISO }: User = AuthState.userFromLocalStorage();

    return !validToISO || new Date() > new Date(validToISO);
  }

  private static userToLocalStorage(user: User) {
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
