import {
  defaults as reservationsStateDefaults,
  ReservationsStateModel,
} from './reservations/reservations.state';
import {
  defaults as driversStateDefaults,
  DriversStateModel,
} from './drivers/drivers.state';
import {
  defaults as parkingLotsStateDefaults,
  ParkingLotStateModel,
} from './parking-lot/parking-lot.state';
import { defaults as uiStateDefaults, UiStateModel } from './ui/ui.state';
import {
  AuthStateModel,
  defaults as authStateDefaults,
} from './auth/auth.state';

export interface StateModel {
  reservations: ReservationsStateModel;
  drivers: DriversStateModel;
  parkingLots: ParkingLotStateModel;
  ui: UiStateModel;
  auth: AuthStateModel;
}
export const defaultState = {
  ui: uiStateDefaults,
  auth: authStateDefaults,
  drivers: driversStateDefaults,
  parkingLots: parkingLotsStateDefaults,
  reservations: reservationsStateDefaults,
};
