import { Injectable } from '@angular/core';
import { AuthQuery } from '../state/auth/auth.query';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../state/auth/auth.model';
import { RouterService } from '../state/router/router.service';

export abstract class RoleGuard implements CanActivate {
  protected constructor(
    protected readonly authQuery: AuthQuery,
    protected readonly routerService: RouterService,
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.correctRole() || this.routerService.unAuthorizedUrlTree();
  }
  abstract correctRole(): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminGuard extends RoleGuard implements CanActivate {
  constructor(authQuery: AuthQuery, routerService: RouterService) {
    super(authQuery, routerService);
  }

  correctRole(): boolean {
    return this.authQuery.role() === Role.ADMIN;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ClerkGuard extends RoleGuard implements CanActivate {
  constructor(authQuery: AuthQuery, routerService: RouterService) {
    super(authQuery, routerService);
  }

  correctRole(): boolean {
    return this.authQuery.role() === Role.CLERK;
  }
}

@Injectable({
  providedIn: 'root',
})
export class DriverGuard extends RoleGuard implements CanActivate {
  constructor(authQuery: AuthQuery, routerService: RouterService) {
    super(authQuery, routerService);
  }

  correctRole(): boolean {
    return this.authQuery.role() === Role.DRIVER;
  }
}
