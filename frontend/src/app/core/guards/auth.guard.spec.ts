import { AuthGuard } from './auth.guard';
import { AuthService } from '../state/auth/auth.service';
import { RouterService } from '../state/router/router.service';
import { Observable, of } from 'rxjs';
import firebase from 'firebase/compat';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import SpyObj = jasmine.SpyObj;
import User = firebase.User;

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: SpyObj<AuthService>;
  let navigationServiceSpy: SpyObj<RouterService>;
  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['currentUser$']);
    navigationServiceSpy = jasmine.createSpyObj('NavigationService', [
      'urlTreeForLoginWithReturnUrl',
    ]);
    guard = new AuthGuard(authServiceSpy, navigationServiceSpy);
  });
  it('Returns true if user is verified', () => {
    authServiceSpy.currentUser$.and.returnValue(
      of({
        emailVerified: true,
      } as User),
    );
    const routeSnapshot = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    (<Observable<boolean>>(
      guard.canActivate(routeSnapshot, state)
    )).subscribe(canActivate => expect(canActivate).toEqual(true));
  });
  it('Calls navigation service when user is not verified providing state url', () => {
    authServiceSpy.currentUser$.and.returnValue(
      of({
        emailVerified: false,
      } as User),
    );
    const routeSnapshot = {} as ActivatedRouteSnapshot;
    const state = {
      url: '/',
    } as RouterStateSnapshot;
    (<Observable<UrlTree>>(
      guard.canActivate(routeSnapshot, state)
    )).subscribe(() =>
      expect(
        navigationServiceSpy.urlTreeForLoginWithReturnUrl,
      ).toHaveBeenCalledWith(state.url),
    );
  });
});
