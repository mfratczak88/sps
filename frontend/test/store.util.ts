import { Store } from '@ngxs/store';
import { Driver } from '../src/app/core/model/driver.model';
import { ParkingLot } from '../src/app/core/model/parking-lot.model';
import { User } from '../src/app/core/model/user.model';
import { mapToObjectWithIds } from '../src/app/core/util';
import { Role } from '../src/app/core/model/auth.model';
import { ParkingLotStateModel } from '../src/app/core/store/parking-lot/parking-lot.state';
import { Reservation } from '../src/app/core/model/reservation.model';
import { ReservationsStateModel } from '../src/app/core/store/reservations/reservations.state';
import { RouterStateModel } from '@ngxs/router-plugin';
import { RouterStateParams } from '../src/app/core/store/routing/routing.state.model';

export const setRouterParams = (store: Store, params: any) =>
  store.reset({
    ...store.snapshot(),
    router: {
      state: {
        params: { ...params },
      },
    },
  });

export const setRouterQueryParams = (store: Store, queryParams: any) =>
  store.reset({
    ...store.snapshot(),
    router: {
      state: {
        queryParams: {
          ...queryParams,
        },
      },
    },
  });

export const setFragment = (store: Store, fragment: string) =>
  store.reset({
    ...store.snapshot(),
    router: {
      state: {
        fragment,
      },
    },
  });

export const authStateWithDriver = {
  name: 'Maciek',
  email: 'mfratczak88@gmail.com',
  id: '3',
  validToISO: new Date().toISOString(),
  authExpiresIn: '900s',
  role: Role.DRIVER,
  loading: false,
};

export const setDriver = (store: Store, driver: Driver) =>
  store.reset({
    ...store.snapshot(),
    drivers: {
      loading: false,
      entities: {
        [driver.id]: driver,
      },
      selectedId: driver.id,
    },
  });

export const setParkingLot = (store: Store, parkingLot: ParkingLot) =>
  store.reset({
    ...store.snapshot(),
    parkingLots: {
      loading: false,
      selectedId: parkingLot.id,
      entities: {
        [parkingLot.id]: parkingLot,
      },
    },
  });

export const setUsers = (store: Store, users: User[]) =>
  store.reset({
    ...store.snapshot(),
    users: {
      entities: mapToObjectWithIds(users),
      loading: false,
    },
  });
export const stateModelForParkingLots = (
  lots: ParkingLot[],
): ParkingLotStateModel => ({
  entities: mapToObjectWithIds(lots),
  loading: false,
  selectedId: null,
});

export const stateModelFroReservations = (
  reservations: Reservation[],
): ReservationsStateModel => ({
  entities: mapToObjectWithIds(reservations),
  count: reservations.length,
  loading: false,
  sorting: {},
  paging: {},
  filters: {},
  selectedId: null,
});

export const routerStateModel = (
  params?: any,
  queryParams?: any,
  fragment?: any,
  url?: string,
): RouterStateModel<RouterStateParams> => ({
  trigger: 'none',
  state: {
    params,
    queryParams,
    fragment,
    url: url || 'foo',
  },
});
