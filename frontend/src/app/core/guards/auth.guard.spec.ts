import SpyObj = jasmine.SpyObj;
import { AuthService } from '../state/auth/auth.service';
import { RouterService } from '../state/router/router.service';
import { AuthGuard } from './auth.guard';
import { AuthQuery } from '../state/auth/auth.query';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

describe('Auth guard', () => {
  let authServiceSpy: SpyObj<AuthService>;
  let authQuerySpy: SpyObj<AuthQuery>;
  let routerServiceSpy: SpyObj<RouterService>;
  let authGuard: AuthGuard;
  const route: Partial<ActivatedRouteSnapshot> = {};
  const state: Partial<RouterStateSnapshot> = {
    url: '/foo',
  };
  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['restoreAuth']);
    routerServiceSpy = jasmine.createSpyObj('RouterService', [
      'urlTreeForLoginWithReturnUrl',
    ]);
    authQuerySpy = jasmine.createSpyObj('AuthQuery', ['loggedIn']);
    authGuard = new AuthGuard(authQuerySpy, authServiceSpy, routerServiceSpy);
  });

  it('returns true if user is logged in', () => {
    authQuerySpy.loggedIn.and.returnValue(true);
    const canActivate = authGuard.canActivate(
      route as ActivatedRouteSnapshot,
      state as RouterStateSnapshot,
    );
    expect(canActivate).toEqual(true);
  });
  it('calls restore auth on auth service when user is not logged in', () => {
    authQuerySpy.loggedIn.and.returnValue(false);
    authServiceSpy.restoreAuth.and.resolveTo(false);

    authGuard.canActivate(
      route as ActivatedRouteSnapshot,
      state as RouterStateSnapshot,
    );

    expect(authServiceSpy.restoreAuth).toHaveBeenCalled();
  });
  it('calls router service for redirect to login on auth failed', () => {
    authQuerySpy.loggedIn.and.returnValue(false);
    authServiceSpy.restoreAuth.and.resolveTo(null);

    (authGuard.canActivate(
      route as ActivatedRouteSnapshot,
      state as RouterStateSnapshot,
    ) as Observable<any>).subscribe(() => {
      expect(
        routerServiceSpy.urlTreeForLoginWithReturnUrl,
      ).toHaveBeenCalledWith('/foo');
    });
  });
  it('returns true if auth can be restored', () => {
    authQuerySpy.loggedIn.and.returnValue(false);
    authServiceSpy.restoreAuth.and.resolveTo({
      id: '31',
    });

    (<Observable<any>>(
      authGuard.canActivate(
        route as ActivatedRouteSnapshot,
        state as RouterStateSnapshot,
      )
    )).subscribe(res => expect(res).toEqual(true));
  });
});
