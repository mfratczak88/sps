import { MomentInTime } from '../time/moment';
import { TimeKeeper } from '../time/time-keeper';

export class ParkingTicket {
  readonly timeOfEntry: MomentInTime;
  readonly validTo: MomentInTime;
  timeOfLeave?: MomentInTime;

  constructor({
    timeOfEntry,
    timeOfLeave,
    validTo,
  }: {
    timeOfEntry: string;
    timeOfLeave?: string;
    validTo: string;
  }) {
    this.timeOfLeave =
      timeOfLeave && TimeKeeper.instance.dateAndTimeFromString(timeOfLeave);
    this.timeOfEntry = TimeKeeper.instance.dateAndTimeFromString(timeOfEntry);
    this.validTo = TimeKeeper.instance.dateAndTimeFromString(validTo);
  }

  return() {
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
