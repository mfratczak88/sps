import { ParkingLotAvailability } from '../parking-lot-availability';
import { IdGenerator } from '../id';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';
import { Reservation } from './reservation';
import { ReservationStatus } from './reservation-status';

export class ReservationFactory {
  constructor(
    private readonly availability: ParkingLotAvailability,
    private readonly idGenerator: IdGenerator,
  ) {}

  async newReservation({
    licensePlate,
    parkingLotId,
    start,
    end,
  }: ReservationData) {
    if (
      !(await this.availability.placeInLotAvailable(parkingLotId, start, end))
    ) {
      throw new DomainException({
        message: MessageCode.NO_PLACE_IN_LOT,
      });
    }
    return new Reservation({
      id: await this.idGenerator.generate(),
      status: ReservationStatus.DRAFT,
      parkingTickets: [],
      scheduledParkingTime: { start, end },
      parkingLotId: parkingLotId,
      licensePlate,
    });
  }
}
export interface ReservationData {
  licensePlate: string;
  parkingLotId: string;
  start: Date;
  end: Date;
}
