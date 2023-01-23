import { Id } from '../../model/common.model';
import { ParkingLot } from '../../model/parking-lot.model';
import { Action, State, StateContext } from '@ngxs/store';
import { ParkingLotApi } from '../../api/parking-lot.api';
import { DriverActions } from '../actions/driver.actions';
import { tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { fullHour, mapToObjectWithIds } from '../../util';
import { AdminActions } from '../actions/admin.actions';
import { DateTime } from 'luxon';
import { UiActions } from '../actions/ui.actions';
import { ToastKeys } from '../../translation-keys';

export interface ParkingLotStateModel {
  entities: {
    [id: Id]: ParkingLot;
  };
  selectedId: Id | null;
  loading: boolean;
}
export const defaults: ParkingLotStateModel = {
  entities: {},
  selectedId: null,
  loading: false,
};
@State<ParkingLotStateModel>({
  name: 'parkingLots',
  defaults,
})
@Injectable({
  providedIn: 'root',
})
export class ParkingLotsState {
  constructor(private readonly api: ParkingLotApi) {}

  @Action([DriverActions.GetParkingLots, AdminActions.GetAllParkingLots])
  getParkingLots({ patchState }: StateContext<ParkingLotStateModel>) {
    patchState({ loading: true });
    return this.api.getAll().pipe(
      tap(parkingLots =>
        patchState({
          entities: mapToObjectWithIds(parkingLots),
          loading: false,
        }),
      ),
    );
  }

  @Action(AdminActions.GetParkingLot)
  getParkingLot(
    { getState, dispatch, patchState }: StateContext<ParkingLotStateModel>,
    { id: selectedId }: AdminActions.GetParkingLot,
  ) {
    const { entities } = getState();
    return entities[selectedId]
      ? patchState({
          selectedId,
        })
      : dispatch(new AdminActions.GetAllParkingLots()).pipe(
          tap(() =>
            patchState({
              selectedId,
            }),
          ),
        );
  }

  @Action(AdminActions.CreateParkingLot)
  createParkingLot(
    { dispatch }: StateContext<ParkingLotStateModel>,
    { address, hoursOfOperation, capacity }: AdminActions.CreateParkingLot,
  ) {
    const { hourFrom, validFrom } = hoursOfOperation;
    return this.api
      .create({
        address,
        capacity,
        hoursOfOperation: {
          ...hoursOfOperation,
          validFrom: fullHour(DateTime.fromJSDate(validFrom), hourFrom),
        },
      })
      .pipe(
        tap(() => dispatch(new AdminActions.GetAllParkingLots())),
        tap(() =>
          dispatch(new UiActions.ShowToast(ToastKeys.PARKING_LOT_CREATED)),
        ),
      );
  }

  @Action(AdminActions.ChangeCapacity)
  changeCapacity(
    { dispatch }: StateContext<ParkingLotStateModel>,
    { newCapacity, parkingLotId }: AdminActions.ChangeCapacity,
  ) {
    return this.api.changeCapacity(newCapacity, parkingLotId).pipe(
      tap(() => dispatch(new AdminActions.GetAllParkingLots())),
      tap(() => dispatch(new UiActions.ShowToast(ToastKeys.CAPACITY_CHANGED))),
    );
  }

  @Action(AdminActions.ChangeOperationHours)
  changeHoursOfOperation(
    { dispatch }: StateContext<ParkingLotStateModel>,
    { hourFrom, hourTo, parkingLotId }: AdminActions.ChangeOperationHours,
  ) {
    return this.api.changeHours({ hourFrom, hourTo }, parkingLotId).pipe(
      tap(() => dispatch(new AdminActions.GetAllParkingLots())),
      tap(() => dispatch(new UiActions.ShowToast(ToastKeys.HOURS_CHANGED))),
    );
  }
}
