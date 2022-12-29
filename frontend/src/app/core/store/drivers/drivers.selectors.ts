import { createSelector } from '@ngxs/store';
import { DriversState, DriversStateModel } from './drivers.state';
import {
  ParkingLotsState,
  ParkingLotStateModel,
} from '../parking-lot/parking-lot.state';

export const currentDriver = createSelector(
  [DriversState],
  ({ selectedDriverId, entities }: DriversStateModel) =>
    selectedDriverId ? entities[selectedDriverId] : undefined,
);
export const loading = createSelector(
  [DriversState],
  ({ loading }: DriversStateModel) => loading,
);
export const vehicles = createSelector(
  [DriversState],
  ({ selectedDriverId, entities }: DriversStateModel) =>
    selectedDriverId ? entities[selectedDriverId].vehicles : [],
);
export const assignedParkingLots = createSelector(
  [DriversState, ParkingLotsState],
  (
    { selectedDriverId, entities }: DriversStateModel,
    { entities: allParkingLots }: ParkingLotStateModel,
  ) => {
    if (!selectedDriverId) return [];

    const driver = entities[selectedDriverId];
    return driver.parkingLotIds.map(id => allParkingLots[id]);
  },
);
export const unAssignedParkingLots = createSelector(
  [DriversState, ParkingLotsState],
  (
    { selectedDriverId, entities }: DriversStateModel,
    { entities: allParkingLots }: ParkingLotStateModel,
  ) => {
    if (!selectedDriverId) return Object.values(allParkingLots);

    const driver = entities[selectedDriverId];
    return Object.keys(allParkingLots)
      .filter(id => !driver.parkingLotIds.includes(id))
      .map(id => allParkingLots[id]);
  },
);
