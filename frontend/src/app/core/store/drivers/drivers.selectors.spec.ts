import {
  assignedParkingLots,
  currentDriver,
  drivers,
  driversWithParkingLotCount,
  unAssignedParkingLots,
  vehicles,
} from './drivers.selectors';
import { mockDriver, mockParkingLots } from '../../../../../test/driver.utils';
import { Driver } from '../../model/driver.model';
import { DriversStateModel } from './drivers.state';
import { stateModelForParkingLots } from '../../../../../test/store.util';

const stateModelForDriver = (driver: Driver): DriversStateModel => {
  const { id } = driver;
  return {
    selectedId: id,
    entities: { [id]: driver },
    loading: false,
  };
};

describe('Drivers selectors', () => {
  describe('Current driver', () => {
    it('Returns driver if exists with this id', () => {
      expect(currentDriver(stateModelForDriver(mockDriver))).toEqual(
        mockDriver,
      );
    });
    it('Returns undefined if not exist', () => {
      expect(
        currentDriver({
          ...stateModelForDriver(mockDriver),
          selectedId: 'foo',
        }),
      ).toEqual(undefined);
    });
  });
  describe('Drivers', () => {
    it('returns all drivers', () => {
      expect(
        drivers({
          selectedId: null,
          loading: false,
          entities: { '3': mockDriver, '4': mockDriver },
        }),
      ).toEqual([mockDriver, mockDriver]);
    });
  });
  describe('Drivers with parking lot count', () => {
    it('returns driver with length === parkingLotIds', () => {
      const driver = { ...mockDriver, parkingLotIds: ['3'] };
      expect(
        driversWithParkingLotCount({
          selectedId: null,
          loading: false,
          entities: { '3': driver },
        }),
      ).toEqual([{ ...driver, parkingLotCount: 1 }]);
    });
  });
  describe('Vehicles', () => {
    it('Returns driver vehicles given his id', () => {
      const { vehicles: driverVehicles } = mockDriver;
      expect(vehicles(stateModelForDriver(mockDriver))).toEqual(driverVehicles);
    });
    it('Returns empty array if selectedId is falsy', () => {
      expect(
        vehicles({ ...stateModelForDriver(mockDriver), selectedId: null }),
      ).toEqual([]);
    });
  });
  describe('Assigned parking lots', () => {
    it('Returns empty array if selectedId is falsy', () => {
      expect(
        assignedParkingLots(
          { ...stateModelForDriver(mockDriver), selectedId: null },
          stateModelForParkingLots(mockParkingLots),
        ),
      ).toEqual([]);
    });
    it('Returns parkingLots from ParkingLotsState taken by selected driver Ids', () => {
      const [lot1] = mockParkingLots;
      expect(
        assignedParkingLots(
          stateModelForDriver({ ...mockDriver, parkingLotIds: [lot1.id] }),
          stateModelForParkingLots(mockParkingLots),
        ),
      ).toEqual([lot1]);
    });
  });
  describe('Unassigned parking lots', () => {
    it('Returns all parking lots from ParkingLotsState if selectedId is falsy', () => {
      const [lot1] = mockParkingLots;
      expect(
        unAssignedParkingLots(
          {
            ...stateModelForDriver({ ...mockDriver, parkingLotIds: [lot1.id] }),
            selectedId: null,
          },
          stateModelForParkingLots(mockParkingLots),
        ),
      ).toEqual(mockParkingLots);
    });
    it('Returns those parking lots from lots state which id is not on selected driver', () => {
      const [lot1, lot2] = mockParkingLots;
      expect(
        unAssignedParkingLots(
          stateModelForDriver({ ...mockDriver, parkingLotIds: [lot2.id] }),
          stateModelForParkingLots(mockParkingLots),
        ),
      ).toEqual([lot1]);
    });
  });
});
