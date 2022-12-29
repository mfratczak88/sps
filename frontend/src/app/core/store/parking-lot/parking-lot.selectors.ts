import { createSelector } from '@ngxs/store';
import { ParkingLotsState, ParkingLotStateModel } from './parking-lot.state';
import { Id } from '../../model/common.model';

export const parkingLotById = (id: Id) =>
  createSelector(
    [ParkingLotsState],
    ({ entities }: ParkingLotStateModel) => entities[id],
  );
