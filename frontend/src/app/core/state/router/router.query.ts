import { RouterQuery as AkitaRouterQuery } from '@datorama/akita-ng-router-store';
import { filter, map, Observable } from 'rxjs';
import {
  BreadCrumbs,
  Fragment,
  ParamKeys,
  QueryParamKeys,
  QueryParams,
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
    this.akitaRouterQuery.selectFragment().pipe(map(x => x === Fragment.EMAIL));

  queryParams$ = (): Observable<QueryParams> =>
    this.akitaRouterQuery.selectQueryParams<QueryParams>();

  activationGuid() {
    return this.akitaRouterQuery.getParams(ParamKeys.ACTIVATION_GUID) || '';
  }

  getParam(paramName: string) {
    return this.akitaRouterQuery.getParams(paramName);
  }

  parkingLotId() {
    return this.akitaRouterQuery.getParams(ParamKeys.PARKING_LOT_ID);
  }

  driverId() {
    return this.akitaRouterQuery.getParams(ParamKeys.DRIVER_ID);
  }

  getPageQueryParam() {
    return this.akitaRouterQuery.getQueryParams(QueryParamKeys.PAGE);
  }

  getPageSizeQueryParam() {
    return this.akitaRouterQuery.getQueryParams(QueryParamKeys.PAGE_SIZE);
  }

  previousActivationGuid() {
    return (
      this.akitaRouterQuery.getQueryParams(
        QueryParamKeys.PREVIOUS_ACTIVATION_GUID,
      ) || ''
    );
  }
}
