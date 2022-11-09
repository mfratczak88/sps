import { DateTime } from 'luxon';
import { fromSqlTime, toSqlTime } from '../period-of-time';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';

export class ParkingTicket {
  private readonly timeOfEntry: DateTime;
  private readonly validTo: DateTime;
  private timeOfLeave?: DateTime;

  constructor({ timeOfEntry, timeOfLeave, validTo }: ParkingTicketPlain) {
    const timeOfEntryDateTime = fromSqlTime(timeOfEntry);
    const validToDateTime = fromSqlTime(validTo);
    const timeOfLeaveDateTime = timeOfLeave && fromSqlTime(timeOfLeave);
    if (
      !timeOfEntryDateTime.isValid ||
      !validToDateTime.isValid ||
      !timeOfEntryDateTime?.isValid
    ) {
      throw new DomainException({
        message: MessageCode.INVALID_PARKING_TICKET_TIME,
      });
    }
    this.timeOfEntry = timeOfEntryDateTime;
    this.validTo = validToDateTime;
    this.timeOfLeave = timeOfLeaveDateTime;
  }

  return() {
    this.timeOfLeave = DateTime.now();
  }

  isReturned() {
    return !!this.timeOfLeave;
  }

  toPlain(): ParkingTicketPlain {
    return {
      timeOfEntry: toSqlTime(this.timeOfEntry),
      timeOfLeave: this.timeOfLeave && toSqlTime(this.timeOfLeave),
      validTo: toSqlTime(this.validTo),
    };
  }
}
export interface ParkingTicketPlain {
  timeOfEntry: string;
  validTo: string;
  timeOfLeave?: string;
}
