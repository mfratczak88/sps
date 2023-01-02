import { stateModelForParkingLots } from '../../../../../test/store.util';
import { mockParkingLots } from '../../../../../test/driver.utils';
import { parkingLotById } from './parking-lot.selectors';

describe('Parking lots selectors', () => {
  describe('Parking lot by id', () => {
    it('Returns entity based on id', () => {
      const stateModel = stateModelForParkingLots(mockParkingLots);
      const [lot] = mockParkingLots;
      const { id } = lot;
      expect(parkingLotById(id)({ ...stateModel, selectedId: id })).toEqual(
        lot,
      );
    });
  });
});
