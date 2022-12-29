import SpyObj = jasmine.SpyObj;
import { MatDialog } from '@angular/material/dialog';
import { AuthApi } from '../src/app/core/api/auth.api';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ReservationValidator } from '../src/app/core/validators/reservation.validator';
import { CanEditReservationPipe } from '../src/app/shared/pipe/can/can-edit-reservation.pipe';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import Spy = jasmine.Spy;

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

export const newReservationValidatorSpy = (): SpyObj<ReservationValidator> =>
  jasmine.createSpyObj('ReservationsValidator', ['dateFn']);

export const newCanEditReservation = (): SpyObj<CanEditReservationPipe> =>
  jasmine.createSpyObj('CanEditReservationPipe', ['']);

export const newStoreSpy = (): SpyObj<Store> =>
  jasmine.createSpyObj('Store', ['dispatch', 'select', 'selectSnapshot']);

export type DispatchSpy = Spy<(...args: any) => Observable<any>>;
export const newDispatchSpy = (store: Store) => spyOn(store, 'dispatch');
