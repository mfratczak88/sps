import { Store } from '@ngxs/store';
import { Driver } from '../src/app/core/model/driver.model';
import { ParkingLot } from '../src/app/core/model/parking-lot.model';
import { User } from '../src/app/core/model/user.model';
import { mapToObjectWithIds } from '../src/app/core/util';
import { Role } from '../src/app/core/model/auth.model';

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
