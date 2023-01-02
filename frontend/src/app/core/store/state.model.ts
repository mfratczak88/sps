import { ReservationsStateModel } from './reservations/reservations.state';
import { DriversStateModel } from './drivers/drivers.state';
import { ParkingLotStateModel } from './parking-lot/parking-lot.state';

export interface StateModel {
  reservations: ReservationsStateModel;
  drivers: DriversStateModel;
  parkingLots: ParkingLotStateModel;
}
