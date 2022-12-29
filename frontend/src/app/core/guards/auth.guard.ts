import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { AuthPaths, TopLevelPaths } from '../../routes';
import { Store } from '@ngxs/store';
import { AuthActions } from '../store/actions/auth.actions';
import { QueryParamKeys } from '../model/router.model';
import { isLoggedIn, userRole } from '../store/auth/auth.selector';
import { Role } from '../model/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly store: Store) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    routerStateSnapshot: RouterStateSnapshot,
  ) {
    if (this.store.selectSnapshot(isLoggedIn)) {
      return this.redirectBasedOnRole(routerStateSnapshot);
    }
    return this.store
      .dispatch(new AuthActions.RestoreAuth())
      .pipe(
        map(() =>
          this.store.selectSnapshot(isLoggedIn)
            ? this.redirectBasedOnRole(routerStateSnapshot)
            : this.router.parseUrl(
                `/${TopLevelPaths.AUTH}/${AuthPaths.SIGN_IN}?${QueryParamKeys.RETURN_URL}=${routerStateSnapshot.url}`,
              ),
        ),
      );
  }

  redirectBasedOnRole(state: RouterStateSnapshot) {
    if (state.url !== '/') return true;
    const role = this.store.selectSnapshot(userRole);
    return this.userRoleToUrlTree[role];
  }

  private get userRoleToUrlTree() {
    return {
      [Role.ADMIN]: this.router.parseUrl(TopLevelPaths.ADMIN_DASHBOARD),
      [Role.DRIVER]: this.router.parseUrl(TopLevelPaths.DRIVER_DASHBOARD),
      [Role.CLERK]: this.router.parseUrl(TopLevelPaths.CLERK_DASHBOARD),
    };
  }
}
