import { RouterState, RouterStateModel } from '@ngxs/router-plugin';
import { createSelector } from '@ngxs/store';
import { RouterStateParams } from './routing.state.model';
import { Fragment, ParamKeys, QueryParamKeys } from '../../model/router.model';

const _paramByName = (
  { state }: RouterStateModel<RouterStateParams>,
  name: string,
) => state?.params[name] || '';

const queryParamByName = (
  { state }: RouterStateModel<RouterStateParams>,
  name: string,
) => state?.queryParams[name] || '';

export const driverId = createSelector(
  [RouterState],
  (state: RouterStateModel<RouterStateParams>) =>
    _paramByName(state, ParamKeys.DRIVER_ID),
);

export const reservationId = createSelector(
  [RouterState],
  (state: RouterStateModel<RouterStateParams>) =>
    _paramByName(state, ParamKeys.RESERVATION_ID),
);

export const parkingLotId = createSelector(
  [RouterState],
  (state: RouterStateModel<RouterStateParams>) =>
    _paramByName(state, ParamKeys.PARKING_LOT_ID),
);

export const activationGuid = createSelector(
  [RouterState],
  (state: RouterStateModel<RouterStateParams>) =>
    _paramByName(state, ParamKeys.ACTIVATION_GUID),
);
export const afterLoginUrl = createSelector(
  [RouterState],
  ({ state }: RouterStateModel<RouterStateParams>) => {
    const queryParams = state?.queryParams || {};
    if (!queryParams[QueryParamKeys.RETURN_URL]) {
      return '/';
    }
    // return url might contain different query params -> expect the first one, the others will not be contained in the returnUrl var
    // those need to be added manually to the url
    const { returnUrl, ...others } = queryParams;
    let url: string = returnUrl;
    others &&
      Object.entries(others).forEach(([queryParamKey, queryParamValue]) => {
        url += `&${queryParamKey}=${queryParamValue}`;
      });
    return url;
  },
);
export const pageQueryParam = createSelector(
  [RouterState],
  (state: RouterStateModel<RouterStateParams>) =>
    queryParamByName(state, QueryParamKeys.PAGE),
);
export const pageSizeQueryParam = createSelector(
  [RouterState],
  (state: RouterStateModel<RouterStateParams>) =>
    queryParamByName(state, QueryParamKeys.PAGE_SIZE),
);
export const queryParams = createSelector(
  [RouterState],
  ({ state }: RouterStateModel<RouterStateParams>) => state?.queryParams || {},
);

export const emailFragment = createSelector(
  [RouterState],
  ({ state }: RouterStateModel<RouterStateParams>) =>
    state?.fragment === Fragment.EMAIL,
);

export const breadCrumbs = createSelector(
  [RouterState],
  ({ state }: RouterStateModel<RouterStateParams>) => state?.breadcrumbs,
);

export const previousActivationGuidQueryParam = createSelector(
  [RouterState],
  (state: RouterStateModel<RouterStateParams>) =>
    queryParamByName(state, QueryParamKeys.PREVIOUS_ACTIVATION_GUID),
);

export const paramByName = (name: string) =>
  createSelector([RouterState], (state: RouterStateModel<RouterStateParams>) =>
    _paramByName(state, name),
  );
