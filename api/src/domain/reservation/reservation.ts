import { Id } from '../id';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';
import { ReservationStatus } from './reservation-status';
import { ScheduledParkingTime } from './scheduled-parking-time';
import { ParkingTicket } from './parking-ticket';
import { ParkingLotAvailability } from '../parking-lot-availability';

/*
 *  Reservation can be confirmed if time left is less than that
 *  **/
export const CONFIRMATION_TIME_START_IN_MINUTES = 240;
/*
 *  Reservation can be confirmed if time left is no more than that
 *  **/
export const CONFIRMATION_TIME_END_IN_MINUTES = 30;

export class Reservation {
  private readonly id: Id;
  private readonly parkingLotId: Id;
  private readonly licensePlate: string;
  private scheduledParkingTime: ScheduledParkingTime;
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
    this.scheduledParkingTime = new ScheduledParkingTime(start, end);
    this.status = status;
    this.parkingTickets = parkingTickets.map((ticket) =>
      ParkingTicket.fromJsDates(ticket),
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
    this.scheduledParkingTime = this.scheduledParkingTime.change(start, end);
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
    if (this.previousTicketNotReturned()) {
      throw new DomainException({
        message: MessageCode.PREVIOUS_TICKET_NOT_RETURNED,
      });
    }
    const ticket = this.scheduledParkingTime.parkingTicket();
    this.parkingTickets.push(ticket);
  }

  returnParkingTicket() {
    const previousTicket = this.lastTicket();
    if (!previousTicket || previousTicket.isReturned()) {
      throw new DomainException({
        message: MessageCode.TICKET_NOT_FOUND,
      });
    }
    previousTicket.return();
  }

  plain() {
    return {
      id: this.id,
      status: this.status,
      parkingLotId: this.parkingLotId,
      licensePlate: this.licensePlate,
      scheduledParkingTime: this.scheduledParkingTime.plain(),
      parkingTickets: this.parkingTickets.map((ticket) => ticket.plain()),
    };
  }

  private previousTicketNotReturned() {
    const last = this.lastTicket();
    return last && !last.isReturned();
  }

  private validateConfirmationTime() {
    const minutesToStart = this.scheduledParkingTime.minutesToStart();
    if (minutesToStart > CONFIRMATION_TIME_START_IN_MINUTES) {
      throw new DomainException({
        message: MessageCode.RESERVATION_CANNOT_BE_CONFIRMED_YET,
      });
    }
    if (minutesToStart < CONFIRMATION_TIME_END_IN_MINUTES) {
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
  start: Date;
  end: Date;
}

interface ReservationArgs {
  id: Id;
  parkingLotId: Id;
  licensePlate: string;
  status: ReservationStatus;
  scheduledParkingTime: { start: Date; end: Date };
  parkingTickets: {
    timeOfEntry: Date;
    timeOfLeave?: Date;
    validTo: Date;
  }[];
}
