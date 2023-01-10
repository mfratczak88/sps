import { Action, State, StateContext } from '@ngxs/store';
import { ClerkActions } from '../../core/store/actions/clerk.actions';
import { VehiclesApi } from '../../core/api/vehicles.api';
import { tap } from 'rxjs';
import { Injectable } from '@angular/core';

export interface VehiclesSearchStateModel {
  loading: boolean;
  licensePlates: string[];
  searchResults: string[];
  selectedLicensePlate: string | null;
}

export const defaults: VehiclesSearchStateModel = {
  licensePlates: [],
  searchResults: [],
  selectedLicensePlate: null,
  loading: false,
};

@State<VehiclesSearchStateModel>({
  name: 'vehiclesSearch',
  defaults,
})
@Injectable({ providedIn: 'root' })
export class VehicleSearchState {
  constructor(private readonly vehicleApi: VehiclesApi) {}

  @Action(ClerkActions.LoadLicensePlates)
  loadLicensePlates({ patchState }: StateContext<VehiclesSearchStateModel>) {
    patchState({ loading: true });
    return this.vehicleApi.findAll().pipe(
      tap(vehicles =>
        patchState({
          licensePlates: vehicles.map(({ licensePlate }) => licensePlate),
          loading: false,
        }),
      ),
    );
  }

  @Action(ClerkActions.SearchLicensePlates)
  searchForLicensePlates(
    { getState, patchState }: StateContext<VehiclesSearchStateModel>,
    { licensePlate }: ClerkActions.SearchLicensePlates,
  ) {
    const { licensePlates } = getState();
    return patchState({
      searchResults: licensePlates.filter(plate =>
        plate.includes(licensePlate),
      ),
    });
  }

  @Action(ClerkActions.LicensePlateChosen)
  licensePlateChose(
    { dispatch, patchState }: StateContext<VehiclesSearchStateModel>,
    { licensePlate }: ClerkActions.LicensePlateChosen,
  ) {
    patchState({
      selectedLicensePlate: licensePlate,
    });
    return dispatch(new ClerkActions.ApplyLicensePlateFilter(licensePlate));
  }

  @Action(ClerkActions.LicensePlateCleared)
  licensePlateCleared({
    dispatch,
    patchState,
  }: StateContext<VehiclesSearchStateModel>) {
    patchState({
      searchResults: [],
      selectedLicensePlate: null,
    });
    patchState({
      selectedLicensePlate: null,
    });
    return dispatch(new ClerkActions.ApplyLicensePlateFilter(''));
  }
}
