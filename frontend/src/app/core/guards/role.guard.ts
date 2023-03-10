import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ErrorPaths, TopLevelPaths } from '../../routes';
import { loading, userRole } from '../store/auth/auth.selector';
import { Role } from '../model/auth.model';
import { map } from 'rxjs/operators';

export abstract class RoleGuard implements CanActivate {
  protected constructor(
    protected readonly store: Store,
    protected readonly router: Router,
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store
      .select(loading)
      .pipe(filter((loading) => !loading))
      .pipe(
        map(() => {
          const role = this.store.selectSnapshot(userRole);
          return (
            this.correctRole(role) ||
            this.router.parseUrl(
              `${TopLevelPaths.ERROR}/${ErrorPaths.UNAUTHORIZED}`,
            )
          );
        }),
      );
  }
  abstract correctRole(role: Role): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminGuard extends RoleGuard implements CanActivate {
  constructor(store: Store, router: Router) {
    super(store, router);
  }

  correctRole(role: Role): boolean {
    return role === Role.ADMIN;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ClerkGuard extends RoleGuard implements CanActivate {
  constructor(store: Store, router: Router) {
    super(store, router);
  }

  correctRole(role: Role): boolean {
    return role === Role.CLERK;
  }
}

@Injectable({
  providedIn: 'root',
})
export class DriverGuard extends RoleGuard implements CanActivate {
  constructor(store: Store, router: Router) {
    super(store, router);
  }

  correctRole(role: Role): boolean {
    return role === Role.DRIVER;
  }
}
