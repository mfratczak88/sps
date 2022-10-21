import { RouterQuery as AkitaRouterQuery } from '@datorama/akita-ng-router-store';
import { filter, map, Observable } from 'rxjs';
import {
  BreadCrumbs,
  Fragment,
  ParamKeys,
  QueryParamKeys,
} from './router.model';
import { Injectable } from '@angular/core';

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

  get activationGuid() {
    return this.akitaRouterQuery.getParams(ParamKeys.ACTIVATION_GUID) || '';
  }

  get previousActivationGuid() {
    return (
      this.akitaRouterQuery.getQueryParams(
        QueryParamKeys.PREVIOUS_ACTIVATION_GUID,
      ) || ''
    );
  }
}
