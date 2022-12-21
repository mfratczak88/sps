import { RouterState, RouterStateModel } from '@ngxs/router-plugin';
import { Selector, State } from '@ngxs/store';
import {
  BreadCrumbs,
  ParamKeys,
  QueryParamKeys,
  QueryParams,
} from '../model/router.model';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
export interface RouterStateParams {
  url: string;
  params: Params;
  queryParams: Params;
  breadcrumbs?: BreadCrumbs;
}
@State<RouterState>({
  name: 'routing',
})
@Injectable({
  providedIn: 'root',
})
export class RoutingState extends RouterState {
  @Selector()
  static driverId(state: RouterStateModel<RouterStateParams>) {
    return RoutingState.paramByName(state)(ParamKeys.DRIVER_ID);
  }

  @Selector()
  static reservationId(state: RouterStateModel<RouterStateParams>) {
    return RoutingState.paramByName(state)(ParamKeys.RESERVATION_ID);
  }

  @Selector()
  static parkingLotId(state: RouterStateModel<RouterStateParams>) {
    return RoutingState.paramByName(state)(ParamKeys.PARKING_LOT_ID);
  }

  @Selector()
  static activationGuid(state: RouterStateModel<RouterStateParams>) {
    return RoutingState.paramByName(state)(ParamKeys.ACTIVATION_GUID);
  }

  @Selector()
  static page(state: RouterStateModel<RouterStateParams>) {
    return RoutingState.queryParamByName(QueryParamKeys.PAGE, state);
  }

  @Selector()
  static pageSize(state: RouterStateModel<RouterStateParams>) {
    return RoutingState.queryParamByName(QueryParamKeys.PAGE_SIZE, state);
  }

  @Selector()
  static queryParams({ state }: RouterStateModel<RouterStateParams>) {
    return (state?.queryParams || {}) as QueryParams;
  }

  @Selector()
  previousActivationGuid(state: RouterStateModel<RouterStateParams>) {
    return RoutingState.queryParamByName(
      QueryParamKeys.PREVIOUS_ACTIVATION_GUID,
      state,
    );
  }

  @Selector()
  static paramByName({ state }: RouterStateModel<RouterStateParams>) {
    return (name: string) => state?.params[name] || '';
  }

  private static queryParamByName(
    name: string,
    { state }: RouterStateModel<RouterStateParams>,
  ) {
    return state?.queryParams[name] || '';
  }
}
