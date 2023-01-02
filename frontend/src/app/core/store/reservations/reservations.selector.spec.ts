import { paging, sorting, count } from './reservations.selector';
import { stateModelFroReservations } from '../../../../../test/store.util';
import { mockReservations } from '../../../../../test/reservation.util';
import { SortBy, SortOrder } from '../../model/reservation.model';

describe('Reservations selectors', () => {
  describe('Sorting', () => {
    it('Returns sortBy & sortOrder from state', () => {
      expect(
        sorting({
          ...stateModelFroReservations(mockReservations),
          sorting: {
            sortBy: SortBy.PARKING_LOT,
            sortOrder: SortOrder.ASCENDING,
          },
        }),
      ).toEqual({ sortBy: SortBy.PARKING_LOT, sortOrder: SortOrder.ASCENDING });
    });
    it('Returns date and desc as default values when sortOrder & sortBy are falsy', () => {
      expect(sorting(stateModelFroReservations(mockReservations))).toEqual({
        sortBy: SortBy.CREATED_AT,
        sortOrder: SortOrder.DESCENDING,
      });
    });
  });
  describe('Paging', () => {
    it('Returns page & pageSize from state', () => {
      expect(
        paging({
          ...stateModelFroReservations(mockReservations),
          paging: {
            page: 10,
            pageSize: 50,
          },
        }),
      ).toEqual({ page: 10, pageSize: 50 });
    });
    it('Returns page = 1 & pageSize = 5 if props in state are falsy', () => {
      expect(paging(stateModelFroReservations(mockReservations))).toEqual({
        page: 1,
        pageSize: 5,
      });
    });
  });
  describe('Count', () => {
    it('Returns count from state', () => {
      expect(
        count({ ...stateModelFroReservations(mockReservations), count: 5 }),
      ).toEqual(5);
    });
  });
});
