import { RouterQuery as AkitaRouterQuery } from '@datorama/akita-ng-router-store';
import { filter, map, Observable } from 'rxjs';
import { BreadCrumbs, Fragment, QueryParamKeys } from './router.model';
import { Injectable } from '@angular/core';
import { AuthActionMode } from '../auth/auth.model';
@Injectable({
  providedIn: 'root',
})
export class RouterQuery {
  constructor(private readonly akitaRouterQuery: AkitaRouterQuery) {}

  breadCrumbs$ = (): Observable<BreadCrumbs> =>
    this.akitaRouterQuery.selectData('breadcrumbs').pipe(filter(x => !!x));

  emailFragment$ = (): Observable<boolean> =>
    this.akitaRouterQuery.selectFragment().pipe(
      filter(x => x === Fragment.EMAIL),
      map(x => !!x),
    );

  authActionModeParam(): AuthActionMode | null {
    return this.akitaRouterQuery.getQueryParams(QueryParamKeys.MODE);
  }

  authActionParams() {
    const mode = this.akitaRouterQuery.getQueryParams(QueryParamKeys.MODE);
    const actionCode = this.akitaRouterQuery.getQueryParams(
      QueryParamKeys.ACTION_CODE,
    );
    return {
      mode,
      actionCode,
    };
  }
}
