import { MomentInTime } from '../time/moment';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';

export class ParkingTicket {
  private readonly timeOfEntry: MomentInTime;
  private readonly validTo: MomentInTime;
  private timeOfLeave?: MomentInTime;

  constructor({
    timeOfEntry,
    timeOfLeave,
    validTo,
  }: {
    timeOfEntry: MomentInTime;
    timeOfLeave?: MomentInTime;
    validTo: MomentInTime;
  }) {
    if (
      validTo.isBefore(timeOfEntry) ||
      (timeOfLeave && timeOfLeave.isBefore(timeOfEntry))
    ) {
      throw new DomainException({
        message: MessageCode.INVALID_PARKING_TICKET_TIMES,
      });
    }
    this.timeOfLeave = timeOfLeave;
    this.timeOfEntry = timeOfEntry;
    this.validTo = validTo;
  }

  return() {
    if (this.isReturned()) {
      throw new DomainException({
        message: MessageCode.CANNOT_RETURN_TICKET_TWICE,
      });
    }
    this.timeOfLeave = MomentInTime.now();
  }

  isReturned() {
    return !!this.timeOfLeave;
  }

  static fromJsDates({
    timeOfEntry,
    timeOfLeave,
    validTo,
  }: ParkingTicketInJsDates) {
    return new ParkingTicket({
      timeOfEntry: new MomentInTime(timeOfEntry),
      timeOfLeave: timeOfLeave && new MomentInTime(timeOfLeave),
      validTo: new MomentInTime(validTo),
    });
  }

  plain(): ParkingTicketInJsDates {
    return {
      validTo: this.validTo.jsDate(),
      timeOfEntry: this.timeOfEntry.jsDate(),
      timeOfLeave: this.timeOfLeave.jsDate(),
    };
  }
}
interface ParkingTicketInJsDates {
  timeOfEntry: Date;
  validTo: Date;
  timeOfLeave?: Date;
}
