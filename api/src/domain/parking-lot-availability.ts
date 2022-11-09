import { Id } from './id';

export abstract class ParkingLotAvailability {
  abstract placeInLotAvailable(
    lotId: Id,
    start: string,
    end: string,
  ): Promise<boolean>;
}
