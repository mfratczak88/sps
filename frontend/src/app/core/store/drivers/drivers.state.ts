import { Id } from '../../model/common.model';
import { TimeHorizon, Vehicle } from '../../model/driver.model';
import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DriversApi } from '../../api/drivers.api';
import { DriverActions } from '../actions/driver.actions';
import { concatMap, tap } from 'rxjs';
import { Reservation } from '../../model/reservation.model';

export interface DriversStateModel {
  entities: {
    [id: Id]: {
      id: string;
      name: string;
      email: string;
      parkingLotIds: Id[];
      vehicles: Vehicle[];
      pendingAction: Reservation[];
      dueNext: Reservation[];
      ongoing: Reservation[];
    };
  };
  selectedDriverId: Id | null;
  loading: boolean;
}
export const defaults: DriversStateModel = {
  entities: {},
  selectedDriverId: null,
  loading: false,
};
@State<DriversStateModel>({
  name: 'drivers',
  defaults,
})
@Injectable({
  providedIn: 'root',
})
export class DriversState {
  constructor(private readonly api: DriversApi) {}

  @Action(DriverActions.GetDriverDetails)
  getDriverDetails(
    { patchState, getState, dispatch }: StateContext<DriversStateModel>,
    { id }: DriverActions.GetDriverDetails,
  ) {
    const { entities } = getState();
    patchState({
      loading: true,
    });
    return this.api
      .getById(id, {
        timeHorizon: [
          TimeHorizon.ONGOING,
          TimeHorizon.DUE_NEXT,
          TimeHorizon.PENDING_ACTION,
        ],
      })
      .pipe(
        tap(driver => {
          const { timeHorizon, ...driverData } = driver;
          const { pendingAction, ongoing, dueNext } = timeHorizon ?? {};
          patchState({
            selectedDriverId: id,
            loading: false,
            entities: {
              ...entities,
              [id]: {
                ...driverData,
                pendingAction: pendingAction || [],
                ongoing: ongoing || [],
                dueNext: dueNext || [],
              },
            },
          });
        }),
        concatMap(() =>
          dispatch(new DriverActions.ReservationFiltersChange(id, true)),
        ),
      );
  }

  @Action(DriverActions.CancelReservation)
  addVehicle(
    { getState, patchState }: StateContext<DriversStateModel>,
    { licensePlate }: DriverActions.AddVehicle,
  ) {
    const state = getState();
    const { selectedDriverId } = state;
    return (
      selectedDriverId &&
      this.api.addVehicle(licensePlate, selectedDriverId).pipe(
        tap(() => {
          const { entities } = state;
          const driver = entities[selectedDriverId];
          driver.vehicles.push({
            licensePlate,
          });
          patchState({
            loading: false,
            entities: { ...entities, driver },
          });
        }),
      )
    );
  }
}
