import SpyObj = jasmine.SpyObj;
import { AuthGuard } from './auth.guard';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { NgxsModule, Store } from '@ngxs/store';
import { AuthState, defaults } from '../store/auth/auth.state';
import { AuthPaths, TopLevelPaths } from '../../routes';
import { AuthActions } from '../store/actions/auth.actions';
import { QueryParamKeys } from '../model/router.model';
import { TestBed } from '@angular/core/testing';
import {
  newAuthApiSpy,
  newSocialAuthServiceSpy,
} from '../../../../test/spy.util';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { AuthApi } from '../api/auth.api';
import { authStateWithDriver } from '../../../../test/store.util';

describe('Auth guard', () => {
  let routerSpy: SpyObj<Router>;
  let store: Store;
  let authGuard: AuthGuard;
  const route: Partial<ActivatedRouteSnapshot> = {};
  const setStoreWithInitialData = () =>
    store.reset({
      ...store.snapshot(),
      auth: {
        ...defaults,
      },
    });
  const setStoreWithDriverData = () =>
    store.reset({
      ...store.snapshot(),
      auth: {
        ...authStateWithDriver,
      },
    });
  const state: Partial<RouterStateSnapshot> = {
    url: '/foo',
  };
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AuthState])],
      providers: [
        {
          provide: AuthApi,
          useValue: newAuthApiSpy(),
        },
        {
          provide: SocialAuthService,
          useValue: newSocialAuthServiceSpy(),
        },
      ],
    });
    store = TestBed.inject(Store);
    authGuard = new AuthGuard(routerSpy, store);
  });

  it('returns true if user is logged in', async () => {
    store.reset({
      ...store.snapshot(),
      auth: {
        ...authStateWithDriver,
      },
    });

    const canActivate = authGuard.canActivate(
      route as ActivatedRouteSnapshot,
      state as RouterStateSnapshot,
    );
    expect(canActivate).toEqual(true);
  });
  it('dispatches restore auth on auth service when user is not logged in', () => {
    setStoreWithInitialData();
    spyOn(store, 'dispatch').and.returnValue(of(null));
    authGuard.canActivate(
      route as ActivatedRouteSnapshot,
      state as RouterStateSnapshot,
    );

    expect(store.dispatch).toHaveBeenCalledWith(new AuthActions.RestoreAuth());
  });
  it('calls router service for redirect to login on auth failed', () => {
    setStoreWithInitialData();
    spyOn(store, 'dispatch').and.returnValue(of(null));

    (authGuard.canActivate(
      route as ActivatedRouteSnapshot,
      state as RouterStateSnapshot,
    ) as Observable<any>).subscribe(() => {
      expect(routerSpy.parseUrl).toHaveBeenCalledWith(
        `/${TopLevelPaths.AUTH}/${AuthPaths.SIGN_IN}?${QueryParamKeys.RETURN_URL}=${state.url}`,
      );
    });
  });
  it('returns parsedUrl based on role if auth can be restored', () => {
    setStoreWithInitialData();
    spyOn(store, 'dispatch').and.callFake(() => of(setStoreWithDriverData()));
    (<Observable<any>>(
      authGuard.canActivate(
        route as ActivatedRouteSnapshot,
        { url: '/' } as RouterStateSnapshot,
      )
    )).subscribe(() =>
      expect(routerSpy.parseUrl).toHaveBeenCalledWith(
        TopLevelPaths.ADMIN_DASHBOARD,
      ),
    );
  });
});
