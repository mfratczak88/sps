import { Id } from '../model/common.model';
import { ParkingLot } from '../model/parking-lot.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ParkingLotApi } from '../api/parking-lot.api';
import { DriverActions } from './actions/driver.actions';
import { tap } from 'rxjs';
import { Injectable } from '@angular/core';

export interface ParkingLotStateModel {
  entities: {
    [id: Id]: ParkingLot;
  };
}
const defaults: ParkingLotStateModel = {
  entities: {},
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

  @Selector()
  static parkingLotById({ entities }: ParkingLotStateModel) {
    return (id: Id) => entities[id];
  }

  @Action(DriverActions.GetParkingLots)
  getParkingLots({ getState, setState }: StateContext<ParkingLotStateModel>) {
    const { entities } = getState();
    return (
      Object.entries(entities).length ||
      this.api.getAll().pipe(
        tap(parkingLots =>
          setState({
            entities: parkingLots.reduce((object, parkingLot) => {
              const { id } = parkingLot;
              return {
                ...object,
                [id]: parkingLot,
              };
            }, {}),
          }),
        ),
      )
    );
  }
}
