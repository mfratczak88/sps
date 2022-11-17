import { Id } from '../id';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';
import { ReservationStatus } from './reservation-status';
import { ScheduledParkingTime } from './scheduled-parking-time';
import { ParkingTicket } from './parking-ticket';
import { ParkingLotAvailability } from '../parking-lot-availability';

/* Rules
 * 1. Driver can create reservation if parking lot has free space (to be checked in parking lot)
 * 2. After reservation is created it has DRAFT status
 * 3. Driver needs to confirm reservation between 4 hours and 30 minutes before scheduled arrival
 * 4. Not confirmed reservations is cancelled by the system
 * 5. Driver can cancel reservation at any time, parking admin can also do that in case there's some emergency
 * 6. Reservation once cancelled cannot be reused
 * 7. On parking lot entry, parking lot clerk issues a parking ticket checking reservation status & time
 * 8. On parking lot leave, driver returns a parking ticket
 * 9. Multiple parking tickets can be issued for a single reservation,
 *    provided previous was returned and next to be issued is within reservation hours
 * 10. Parking time can be changed if reservation is in draft state
 * **/

export class Reservation {
  private readonly id: Id;
  private readonly parkingLotId: Id;
  private readonly licensePlate: string;
  private scheduledParkingPeriod: ScheduledParkingTime;
  private status: ReservationStatus;
  private readonly parkingTickets: ParkingTicket[];

  constructor({
    id,
    status,
    parkingLotId,
    scheduledParkingTime: { start, end },
    parkingTickets,
    licensePlate,
  }: ReservationArgs) {
    this.id = id;
    this.parkingLotId = parkingLotId;
    this.licensePlate = licensePlate;
    this.scheduledParkingPeriod = new ScheduledParkingTime(start, end);
    this.status = status;
    this.parkingTickets = parkingTickets.map(
      (ticket) => new ParkingTicket(ticket),
    );
  }

  confirm() {
    if (this.status === ReservationStatus.CANCELLED) {
      throw new DomainException({
        message: MessageCode.RESERVATION_IS_CANCELLED,
      });
    }
    if (this.status === ReservationStatus.CONFIRMED) {
      throw new DomainException({
        message: MessageCode.RESERVATION_IS_CONFIRMED,
      });
    }
    this.validateConfirmationTime();
    this.status = ReservationStatus.CONFIRMED;
  }

  cancel() {
    if (this.status === ReservationStatus.CANCELLED) {
      throw new DomainException({
        message: MessageCode.RESERVATION_IS_CANCELLED,
      });
    }
    this.status = ReservationStatus.CANCELLED;
  }

  async changeTime(
    { start, end }: ParkingTime,
    availability: ParkingLotAvailability,
  ) {
    if (
      this.status === ReservationStatus.CANCELLED ||
      this.status === ReservationStatus.CONFIRMED
    ) {
      throw new DomainException({
        message: MessageCode.SCHEDULED_TIME_CANNOT_BE_CHANGED_ANYMORE,
      });
    }
    if (
      !(await availability.placeInLotAvailable(this.parkingLotId, start, end))
    ) {
      throw new DomainException({
        message: MessageCode.NO_PLACE_IN_LOT,
      });
    }
    this.scheduledParkingPeriod = this.scheduledParkingPeriod.change(
      start,
      end,
    );
  }

  issueParkingTicket() {
    if (this.status === ReservationStatus.DRAFT) {
      throw new DomainException({
        message: MessageCode.RESERVATION_NEEDS_TO_BE_CONFIRMED_FIRST,
      });
    }
    if (this.status === ReservationStatus.CANCELLED) {
      throw new DomainException({
        message: MessageCode.RESERVATION_IS_CANCELLED,
      });
    }
    if (this.scheduledParkingPeriod.inThePast()) {
      throw new DomainException({
        message: MessageCode.RESERVED_PARKING_TIME_IN_THE_PAST,
      });
    }
    if (this.previousTicketNotReturned()) {
      throw new DomainException({
        message: MessageCode.PREVIOUS_TICKET_NOT_RETURNED,
      });
    }
    const ticket = this.scheduledParkingPeriod.parkingTicket();
    this.parkingTickets.push(ticket);
    return ticket.toPlain();
  }

  returnParkingTicket() {
    const previousTicket = this.lastTicket();
    if (!previousTicket) {
      throw new DomainException({
        message: MessageCode.TICKET_NOT_FOUND,
      });
    }
    if (previousTicket.isReturned()) {
      throw new DomainException({
        message: MessageCode.TICKET_ALREADY_RETURNED,
      });
    }
    previousTicket.return();
  }

  toPlain() {
    return {
      id: this.id,
      parkingLotId: this.parkingLotId,
      licensePlate: this.licensePlate,
      status: this.status,
      scheduledParkingTime: this.scheduledParkingPeriod.toPlain(),
      parkingTickets: this.parkingTickets.map((ticket) => ticket.toPlain()),
    };
  }
  private previousTicketNotReturned() {
    const last = this.lastTicket();
    return last && !last.isReturned();
  }

  private validateConfirmationTime() {
    const minutesToStart = this.scheduledParkingPeriod.minutesToStart();
    if (minutesToStart > 240) {
      throw new DomainException({
        message: MessageCode.RESERVATION_CANNOT_BE_CONFIRMED_YET,
      });
    }
    if (minutesToStart < 30) {
      throw new DomainException({
        message: MessageCode.RESERVATION_CANNOT_BE_CONFIRMED_ANYMORE,
      });
    }
  }

  private lastTicket() {
    return this.parkingTickets.length
      ? this.parkingTickets[this.parkingTickets.length - 1]
      : undefined;
  }
}

interface ParkingTime {
  start: string;
  end: string;
}

interface ReservationArgs {
  id: Id;
  parkingLotId: Id;
  licensePlate: string;
  status: ReservationStatus;
  scheduledParkingTime: { start: string; end: string };
  parkingTickets: {
    timeOfEntry: string;
    timeOfLeave?: string;
    validTo: string;
  }[];
}
