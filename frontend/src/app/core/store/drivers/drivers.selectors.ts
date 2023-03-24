import { createSelector } from '@ngxs/store';
import {
  DriversState,
  DriversStateModel,
  DriversStateModelEntity,
} from './drivers.state';
import {
  ParkingLotsState,
  ParkingLotStateModel,
} from '../parking-lot/parking-lot.state';
import { allEntities, loadingSelector, selectedEntity } from '../selectors';

export const currentDriver = selectedEntity<
  DriversStateModelEntity,
  DriversStateModel
>([DriversState]);

export const loading = loadingSelector([DriversState]);

export const drivers = allEntities<DriversStateModelEntity, DriversStateModel>([
  DriversState,
]);

export const driversWithParkingLotCount = createSelector(
  [DriversState],
  ({ entities }: DriversStateModel) =>
    Object.values(entities).map((entity) => ({
      ...entity,
      parkingLotCount: entity.parkingLotIds.length,
    })),
);

export const vehicles = createSelector(
  [DriversState],
  ({ selectedId, entities }: DriversStateModel) =>
    selectedId ? entities[selectedId].vehicles : [],
);

export const assignedParkingLots = createSelector(
  [DriversState, ParkingLotsState],
  (
    { selectedId, entities }: DriversStateModel,
    { entities: allParkingLots }: ParkingLotStateModel,
  ) => {
    if (!selectedId) return [];

    const driver = entities[selectedId];
    return driver.parkingLotIds.map((id) => allParkingLots[id]);
  },
);

export const unAssignedParkingLots = createSelector(
  [DriversState, ParkingLotsState],
  (
    { selectedId, entities }: DriversStateModel,
    { entities: allParkingLots }: ParkingLotStateModel,
  ) => {
    if (!selectedId) return Object.values(allParkingLots);

    const driver = entities[selectedId];
    return Object.keys(allParkingLots)
      .filter((id) => !driver.parkingLotIds.includes(id))
      .map((id) => allParkingLots[id]);
  },
);
