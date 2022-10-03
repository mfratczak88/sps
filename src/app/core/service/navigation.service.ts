import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthPaths, TopLevelPaths } from '../../app-routing.module';

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
}
