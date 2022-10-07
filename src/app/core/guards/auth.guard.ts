import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { NavigationService } from '../service/navigation.service';
import { AuthQuery } from '../state/auth/auth.query';
import { AuthService } from '../state/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly navigationService: NavigationService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.currentUser$().pipe(
      map(user => {
        if (!user?.emailVerified) {
          return this.navigationService.urlTreeForLoginWithReturnUrl(state.url);
        }
        return true;
      }),
    );
  }
}
