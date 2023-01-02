import SpyObj = jasmine.SpyObj;
import Spy = jasmine.Spy;
import { MatDialog } from '@angular/material/dialog';
import { AuthApi } from '../src/app/core/api/auth.api';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

export const newMatDialogSpy = (): SpyObj<MatDialog> =>
  jasmine.createSpyObj('MatDialog', ['open', 'afterClosed']);

export const newAuthApiSpy = (): SpyObj<AuthApi> =>
  jasmine.createSpyObj('AuthApi', [
    'login',
    'loginWithGoogle',
    'register',
    'confirmRegistration',
    'changePassword',
    'refreshToken',
    'logout',
    'resendActivationLink',
  ]);
export const newSocialAuthServiceSpy = (): SpyObj<SocialAuthService> =>
  jasmine.createSpyObj('SocialAuth', ['signIn']);

export type DispatchSpy = Spy<(...args: any) => Observable<any>>;
export const newDispatchSpy = (store: Store) => spyOn(store, 'dispatch');
export const newContextSpy = <T>(): SpyObj<StateContext<T>> => ({
  getState: jasmine.createSpy(),
  setState: jasmine.createSpy(),
  patchState: jasmine.createSpy(),
  dispatch: jasmine.createSpy(),
});
