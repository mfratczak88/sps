import { Route } from '@angular/router';

export enum QueryParamKeys {
  RETURN_URL = 'returnUrl',
  PREVIOUS_ACTIVATION_GUID = 'previousActivationGuid',
  PAGE = 'page',
  PAGE_SIZE = 'pageSize',
  SORT_BY = 'sortBy',
  SORT_ORDER = 'sortOrder',
}
export enum ParamKeys {
  ACTIVATION_GUID = 'activationGuid',
  PARKING_LOT_ID = 'parkingLotId',
  DRIVER_ID = 'driverId',
  RESERVATION_ID = 'reservationId',
}
export enum Fragment {
  EMAIL = 'email',
}
export interface BreadCrumbs {
  label: string;
  path: string;
  parent?: Route;
}
export interface QueryParams {
  [QueryParamKeys.PAGE]: string;
  [QueryParamKeys.PAGE_SIZE]: string;
  [QueryParamKeys.SORT_BY]: string;
  [QueryParamKeys.SORT_ORDER]: string;
}
