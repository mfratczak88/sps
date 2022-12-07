import { Injectable, NgZone } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import {
  AdminPaths,
  AuthPaths,
  DriverPaths,
  ErrorPaths,
  TopLevelPaths,
} from 'src/app/routes';

import { QueryParamKeys } from './router.model';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(
    private readonly router: Router,
    private readonly ngZone: NgZone,
  ) {}

  urlTreeForLoginWithReturnUrl(returnUrl: string) {
    return this.router.parseUrl(
      `/${TopLevelPaths.AUTH}/${AuthPaths.SIGN_IN}?${QueryParamKeys.RETURN_URL}=${returnUrl}`,
    );
  }

  adminDashBoardUrlTree() {
    return this.router.parseUrl(TopLevelPaths.ADMIN_DASHBOARD);
  }

  clerkDashboardUrlTree() {
    return this.router.parseUrl(TopLevelPaths.CLERK_DASHBOARD);
  }

  driverDashboardUrlTree() {
    return this.router.parseUrl(TopLevelPaths.DRIVER_DASHBOARD);
  }

  toAdminParkingLotDetails(id: string) {
    return this.router.navigate([
      `/${TopLevelPaths.ADMIN_DASHBOARD}/${AdminPaths.PARKING}/${id}`,
    ]);
  }

  toCreateReservation() {
    return this.router.navigate([
      `/${TopLevelPaths.DRIVER_DASHBOARD}/${DriverPaths.RESERVATIONS}/${DriverPaths.CREATE_RESERVATION}`,
    ]);
  }

  unAuthorizedUrlTree() {
    return this.router.parseUrl(
      `${TopLevelPaths.ERROR}/${ErrorPaths.UNAUTHORIZED}`,
    );
  }

  toAdminParkingLot() {
    return this.router.navigate([
      `/${TopLevelPaths.ADMIN_DASHBOARD}/${AdminPaths.PARKING}`,
    ]);
  }

  toCreateParkingLot() {
    return this.router.navigate([
      `${TopLevelPaths.ADMIN_DASHBOARD}/${AdminPaths.PARKING}/${AdminPaths.CREATE_PARKING}`,
    ]);
  }

  toSameRoute(extras?: NavigationExtras | undefined) {
    return this.router.navigate([], extras);
  }

  toRoot() {
    return this.router.navigateByUrl('/');
  }

  reload() {
    window.location.reload();
  }

  toSignUp() {
    return this.router.navigate([
      `/${TopLevelPaths.AUTH}/${AuthPaths.SIGN_UP}`,
    ]);
  }

  toSignIn() {
    return this.router.navigate([
      `/${TopLevelPaths.AUTH}/${AuthPaths.SIGN_IN}`,
    ]);
  }

  toPasswordReset() {
    return this.router.navigate([
      `/${TopLevelPaths.AUTH}/${AuthPaths.FORGOT_PASSWORD}`,
    ]);
  }

  toInternalServerErrorPage() {
    return this.ngZone.run(() =>
      this.router.navigate([
        `/${TopLevelPaths.ERROR}/${ErrorPaths.INTERNAL_SERVER_ERROR}`,
      ]),
    );
  }

  navigateAfterLogin() {
    const queryParams = this.queryParamMapFromCurrentRoute();
    if (!queryParams.get(QueryParamKeys.RETURN_URL)) {
      return this.router.navigate(['/']);
    }
    // return url might contain different query params -> expect the first one, the others will not be contained in the returnUrl var
    // those need to be added manually to the url
    const { returnUrl, ...others } = this.queryParamsFromCurrentRoute();
    let url: string = returnUrl;
    others &&
      Object.entries(others).forEach(([queryParamKey, queryParamValue]) => {
        url += `&${queryParamKey}=${queryParamValue}`;
      });
    return this.router.navigateByUrl(url, { replaceUrl: true });
  }

  to404() {
    return this.router.navigate([
      `${TopLevelPaths.ERROR}/${ErrorPaths.NOT_FOUND}`,
    ]);
  }

  toResendActivationLink(activationGuid: string) {
    return this.router.navigate([
      `/${TopLevelPaths.AUTH}/${AuthPaths.RESEND_ACTIVATION_LINK}`,
      activationGuid,
    ]);
  }

  changePageQueryParam(page: number) {
    this.router.navigate([], {
      relativeTo: this.router.routerState.root,
      queryParams: {
        page,
      },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  private queryParamMapFromCurrentRoute() {
    return this.router.routerState.snapshot.root.queryParamMap;
  }

  private queryParamsFromCurrentRoute() {
    return this.router.routerState.snapshot.root.queryParams;
  }

  toDriverDetails(id: string) {
    this.router.navigate([
      `/${TopLevelPaths.ADMIN_DASHBOARD}/${AdminPaths.DRIVERS}/${id}`,
    ]);
  }

  toDriverReservations() {
    return this.router.navigate([
      `/${TopLevelPaths.DRIVER_DASHBOARD}/${DriverPaths.RESERVATIONS}`,
    ]);
  }
}
