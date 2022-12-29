import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ErrorPaths, TopLevelPaths } from '../../routes';
import { userRole } from '../store/auth/auth.selector';
import { Role } from '../model/auth.model';

export abstract class RoleGuard implements CanActivate {
  protected constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return (
      this.correctRole(this.store.selectSnapshot(userRole)) ||
      this.router.parseUrl(`${TopLevelPaths.ERROR}/${ErrorPaths.UNAUTHORIZED}`)
    );
  }
  abstract correctRole(role: Role): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminGuard extends RoleGuard implements CanActivate {
  correctRole(role: Role): boolean {
    return role === Role.ADMIN;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ClerkGuard extends RoleGuard implements CanActivate {
  correctRole(role: Role): boolean {
    return role === Role.CLERK;
  }
}

@Injectable({
  providedIn: 'root',
})
export class DriverGuard extends RoleGuard implements CanActivate {
  correctRole(role: Role): boolean {
    return role === Role.DRIVER;
  }
}
