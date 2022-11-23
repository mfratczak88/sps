import { Id } from './id';

export abstract class ParkingLotAvailability {
  abstract placeInLotAvailable(
    lotId: Id,
    start: Date,
    end: Date,
  ): Promise<boolean>;
}
