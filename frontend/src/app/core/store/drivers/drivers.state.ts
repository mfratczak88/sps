import { Id } from '../../model/common.model';
import { TimeHorizon, Vehicle } from '../../model/driver.model';
import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DriversApi } from '../../api/drivers.api';
import { DriverActions } from '../actions/driver.actions';
import { concatMap, tap } from 'rxjs';
import { Reservation } from '../../model/reservation.model';
import { AdminActions } from '../actions/admin.actions';
import { mapToObjectWithIds } from '../../util';
import { UiActions } from '../actions/ui.actions';
import { ToastKeys } from '../../translation-keys';

export interface DriversStateModelEntity {
  id: string;
  name: string;
  email: string;
  parkingLotIds: Id[];
  vehicles: Vehicle[];
  pendingAction?: Reservation[];
  dueNext?: Reservation[];
  ongoing?: Reservation[];
}

export interface DriversStateModel {
  entities: {
    [id: Id]: DriversStateModelEntity;
  };
  selectedId: Id | null;
  loading: boolean;
}
export const defaults: DriversStateModel = {
  entities: {},
  selectedId: null,
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
    { id }: DriverActions.GetDriverDetails | AdminActions.GetDriverDetails,
  ) {
    const { entities } = getState();
    patchState({ loading: true });
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
            selectedId: id,
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

  @Action(AdminActions.GetDriverDetails)
  getAdminDriverDetails(
    { patchState, getState }: StateContext<DriversStateModel>,
    { id }: DriverActions.GetDriverDetails | AdminActions.GetDriverDetails,
  ) {
    const { entities } = getState();
    patchState({ loading: true });
    return this.api.getById(id).pipe(
      tap(driver => {
        patchState({
          selectedId: id,
          loading: false,
          entities: {
            ...entities,
            [id]: driver,
          },
        });
      }),
    );
  }

  @Action(AdminActions.AssignParkingLot)
  assignParkingLot(
    { dispatch }: StateContext<DriversStateModel>,
    { parkingLotId, driverId }: AdminActions.AssignParkingLot,
  ) {
    return this.api.assignParkingLot({ parkingLotId, driverId }).pipe(
      tap(() => dispatch(new AdminActions.GetAllDrivers())),
      tap(() =>
        dispatch(new UiActions.ShowToast(ToastKeys.PARKING_LOT_ASSIGNED)),
      ),
    );
  }

  @Action(AdminActions.RemoveParkingLotAssignment)
  removeParkingLotAssignment(
    { dispatch }: StateContext<DriversStateModel>,
    { parkingLotId, driverId }: AdminActions.RemoveParkingLotAssignment,
  ) {
    return this.api.removeParkingLotAssignment({ parkingLotId, driverId }).pipe(
      tap(() => dispatch(new AdminActions.GetAllDrivers())),
      tap(() =>
        dispatch(
          new UiActions.ShowToast(ToastKeys.PARKING_LOT_ASSIGNMENT_REMOVED),
        ),
      ),
    );
  }

  @Action(AdminActions.GetAllDrivers)
  getAllDrivers({ patchState }: StateContext<DriversStateModel>) {
    patchState({ loading: true });
    return this.api.getAll().pipe(
      tap(drivers => {
        patchState({
          entities: mapToObjectWithIds(drivers),
          loading: false,
        });
      }),
    );
  }

  @Action(DriverActions.CancelReservation)
  addVehicle(
    { getState, patchState, dispatch }: StateContext<DriversStateModel>,
    { licensePlate }: DriverActions.AddVehicle,
  ) {
    patchState({ loading: true });
    const state = getState();
    const { selectedId } = state;
    return (
      selectedId &&
      this.api.addVehicle(licensePlate, selectedId).pipe(
        tap(() => {
          const { entities } = state;
          const driver = entities[selectedId];
          driver.vehicles.push({
            licensePlate,
          });
          patchState({
            loading: false,
            entities: { ...entities, driver },
          });
        }),
        tap(() => dispatch(new UiActions.ShowToast(ToastKeys.VEHICLE_ADDED))),
      )
    );
  }
}
