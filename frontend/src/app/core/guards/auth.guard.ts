import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { from, map, Observable } from 'rxjs';
import { RouterService } from '../state/router/router.service';
import { AuthQuery } from '../state/auth/auth.query';
import { AuthService } from '../state/auth/auth.service';
import { Role } from '../state/auth/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authQuery: AuthQuery,
    private readonly authService: AuthService,
    private readonly routerService: RouterService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authQuery.loggedIn()) {
      return this.redirectBasedOnRole(state);
    }
    return from(this.authService.restoreAuth()).pipe(
      map(user => {
        if (!user) {
          return this.routerService.urlTreeForLoginWithReturnUrl(state.url);
        }
        return this.redirectBasedOnRole(state);
      }),
    );
  }

  redirectBasedOnRole(state: RouterStateSnapshot) {
    if (state.url !== '/') return true;
    const role = this.authQuery.role();
    if (role === Role.CLERK) {
      return this.routerService.clerkDashboardUrlTree();
    } else if (role === Role.ADMIN) {
      return this.routerService.adminDashBoardUrlTree();
    } else {
      return this.routerService.driverDashboardUrlTree();
    }
  }
}
