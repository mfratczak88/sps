import { ParkingLotReadModel } from './parking-lot.read-model';

export abstract class ParkingLotFinder {
  abstract findAll(): Promise<ParkingLotReadModel[]>;
}
