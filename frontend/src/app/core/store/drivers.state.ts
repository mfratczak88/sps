import { Id } from '../model/common.model';
import { TimeHorizon, Vehicle } from '../model/driver.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DriversApi } from '../api/drivers.api';
import { DriverActions } from './actions/driver.actions';
import { concatMap, mergeMap, tap } from 'rxjs';
import { Reservation } from '../model/reservation.model';
import { ParkingLotsState, ParkingLotStateModel } from './parking-lot.state';
import { ParkingLot } from '../model/parking-lot.model';

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

  @Selector([ParkingLotsState])
  static unAssignedParkingLots(
    { selectedDriverId, entities }: DriversStateModel,
    { entities: allParkingLots }: ParkingLotStateModel,
  ): ParkingLot[] {
    if (!selectedDriverId) return Object.values(allParkingLots);

    const driver = entities[selectedDriverId];
    return Object.keys(allParkingLots)
      .filter(id => !driver.parkingLotIds.includes(id))
      .map(id => allParkingLots[id]);
  }

  @Selector([ParkingLotsState])
  static assignedParkingLots(
    { selectedDriverId, entities }: DriversStateModel,
    { entities: allParkingLots }: ParkingLotStateModel,
  ): ParkingLot[] {
    if (!selectedDriverId) return [];

    const driver = entities[selectedDriverId];
    return driver.parkingLotIds.map(id => allParkingLots[id]);
  }

  @Selector()
  static vehicles({
    entities,
    selectedDriverId,
  }: DriversStateModel): Vehicle[] {
    return selectedDriverId ? entities[selectedDriverId].vehicles : [];
  }

  @Selector()
  static currentDriver({ entities, selectedDriverId }: DriversStateModel) {
    return selectedDriverId ? entities[selectedDriverId] : undefined;
  }

  @Selector()
  static loading({ loading }: DriversStateModel): boolean {
    return loading;
  }

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
