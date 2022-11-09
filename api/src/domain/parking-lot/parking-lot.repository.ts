import { Id } from '../id';
import { ParkingLot } from './parking-lot';

export abstract class ParkingLotRepository {
  abstract findByIdOrElseThrow(id: Id): Promise<ParkingLot>;
  abstract save(lot: ParkingLot): Promise<void>;
}
