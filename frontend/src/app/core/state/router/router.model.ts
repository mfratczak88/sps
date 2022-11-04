import { Route } from '@angular/router';

export enum QueryParamKeys {
  RETURN_URL = 'returnUrl',
  PREVIOUS_ACTIVATION_GUID = 'previousActivationGuid',
}
export enum ParamKeys {
  ACTIVATION_GUID = 'activationGuid',
  PARKING_LOT_ID = 'parkingLotId',
  DRIVER_ID = 'driverId',
}
export enum Fragment {
  EMAIL = 'email',
}
export interface BreadCrumbs {
  label: string;
  path: string;
  parent?: Route;
}
