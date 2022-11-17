import { MomentInTime } from '../time/moment';
import { TimeKeeper } from '../time/time-keeper';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';

export class ParkingTicket {
  private readonly timeOfEntry: MomentInTime;
  private readonly validTo: MomentInTime;
  private timeOfLeave?: MomentInTime;

  constructor({
    timeOfEntry: entry,
    timeOfLeave: leave,
    validTo: valid,
  }: {
    timeOfEntry: string;
    timeOfLeave?: string;
    validTo: string;
  }) {
    const timeOfLeave =
      leave && TimeKeeper.instance.dateAndTimeFromString(leave);
    const timeOfEntry = TimeKeeper.instance.dateAndTimeFromString(entry);
    const validTo = TimeKeeper.instance.dateAndTimeFromString(valid);

    if (validTo.isBefore(timeOfEntry)) {
      throw new DomainException({
        message: MessageCode.INVALID_PARKING_TICKET_TIMES,
      });
    }
    this.timeOfLeave = timeOfLeave;
    this.timeOfEntry = timeOfEntry;
    this.validTo = validTo;
  }

  return() {
    if (this.timeOfLeave) {
      throw new DomainException({
        message: MessageCode.CANNOT_RETURN_TICKET_TWICE,
      });
    }
    this.timeOfLeave = TimeKeeper.instance.dateAndTimeNow();
  }

  isReturned() {
    return !!this.timeOfLeave;
  }

  toPlain(): ParkingTicketPlain {
    return {
      timeOfLeave: this.timeOfLeave?.toString(),
      validTo: this.validTo.toString(),
      timeOfEntry: this.timeOfEntry.toString(),
    };
  }
}
export interface ParkingTicketPlain {
  timeOfEntry: string;
  validTo: string;
  timeOfLeave?: string;
}
