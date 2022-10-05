import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthPaths, ErrorPaths, TopLevelPaths } from '../../app-routing.module';
import { AuthActionCodeQueryParams, AuthActionMode } from '../model/auth.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private readonly router: Router) {}

  urlTreeForLoginWithReturnUrl(returnUrl: string) {
    return this.router.parseUrl(
      `/${TopLevelPaths.AUTH}/${AuthPaths.SIGN_IN}?returnUrl=${returnUrl}`,
    );
  }

  toSameRoute(extras?: NavigationExtras | undefined) {
    return this.router.navigate([], extras);
  }

  toRoot() {
    return this.router.navigate(['/']);
  }

  toSignUp() {
    return this.router.navigate([
      `/${TopLevelPaths.AUTH}/${AuthPaths.SIGN_UP}`,
    ]);
  }

  toInvalidEmailVerifyLink() {
    return this.router.navigate([
      `/${TopLevelPaths.AUTH}/${AuthPaths.INVALID_EMAIL_VERIFY_LINK}`,
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
    return this.router.navigate([
      `/${TopLevelPaths.ERROR}/${ErrorPaths.INTERNAL_SERVER_ERROR}`,
    ]);
  }

  navigateAfterLogin(activatedRoute: ActivatedRoute) {
    if (!activatedRoute.snapshot.queryParams['returnUrl']) {
      return this.router.navigate(['/']);
    }
    // return url might contain different query params -> expect the first one, the others will not be contained in the returnUrl var
    // those need to be added manually to the url
    const { returnUrl, ...others } = activatedRoute.snapshot.queryParams;
    let url: string = returnUrl;
    others &&
      Object.entries(others).forEach(([queryParamKey, queryParamValue]) => {
        url += `&${queryParamKey}=${queryParamValue}`;
      });
    return this.router.navigateByUrl(url, { replaceUrl: true });
  }

  actionCodeParamsFromActivatedRoute(
    activatedRoute: ActivatedRoute,
  ): AuthActionCodeQueryParams {
    const queryParamMap = activatedRoute.snapshot.queryParamMap;
    return {
      mode: queryParamMap.get('mode') as AuthActionMode,
      oobCode: queryParamMap.get('oobCode'),
    };
  }

  to404() {
    return this.router.navigate([
      `${TopLevelPaths.ERROR}/${ErrorPaths.NOT_FOUND}`,
    ]);
  }
}
