import { createSelector } from '@ngxs/store';
import { ParkingLotsState, ParkingLotStateModel } from './parking-lot.state';
import { Id } from '../../model/common.model';
import { allEntities, loadingSelector, selectedEntity } from '../selectors';
import { ParkingLot } from '../../model/parking-lot.model';

export const parkingLotById = (id: Id) =>
  createSelector(
    [ParkingLotsState],
    ({ entities }: ParkingLotStateModel) => entities[id],
  );
export const parkingLots = allEntities<ParkingLot, ParkingLotStateModel>([
  ParkingLotsState,
]);
export const loading = loadingSelector([ParkingLotsState]);
export const active = selectedEntity<ParkingLot, ParkingLotStateModel>([
  ParkingLotsState,
]);
