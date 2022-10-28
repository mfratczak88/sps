import { Id } from './id';
import { Address } from './address';
import { DomainException } from './domain.exception';
import { MessageCode } from '../message';
import { Validate } from './validate.decorator';
import { IsDefined, IsNotEmpty, IsPositive } from 'class-validator';
import { DateTime } from 'luxon';
@Validate
export class ParkingLot {
  @IsNotEmpty()
  readonly id: Id;

  @IsDefined()
  readonly address: Address;

  @IsPositive()
  capacity: number;

  private operationHours: OperationHours;

  constructor(
    id: Id,
    address: Address,
    capacity: number,
    operationHours: HoursOfOperation,
  ) {
    this.id = id;
    this.address = address;
    this.capacity = capacity;
    this.operationHours = new OperationHours(operationHours);
  }

  changeCapacity(newCapacity: number) {
    if (newCapacity <= 0) {
      throw new DomainException({
        message: MessageCode.NON_POSITIVE_LOT_CAPACITY,
      });
    }
    if (this.capacity === newCapacity) {
      throw new DomainException({
        message: MessageCode.SAME_CAPACITY,
      });
    }
    this.capacity = newCapacity;
  }

  changeOperationHours(hours: HoursOfOperation) {
    this.operationHours = this.operationHours.change(hours);
  }

  get hoursOfOperation(): HoursOfOperation {
    return this.operationHours.toPlainObject();
  }

  open(hours: HoursOfOperation) {
    return this.operationHours.equal(hours);
  }

  hasCapacity(capacity: number) {
    return this.capacity === capacity;
  }

  hasId(id: Id) {
    return this.id === id;
  }
}
export interface HoursOfOperation {
  hourFrom: string;
  hourTo: string;
}

class OperationHours {
  readonly hourFrom: DateTime;
  readonly hourTo: DateTime;
  constructor(hours: HoursOfOperation) {
    const { hourFrom, hourTo } = OperationHours.parseHoursOfOperation(hours);
    OperationHours.validateHours(hourFrom, hourTo);
    this.hourFrom = hourFrom;
    this.hourTo = hourTo;
  }

  change(hours: HoursOfOperation) {
    return new OperationHours(hours);
  }

  private static validateHours(hourFrom: DateTime, hourTo: DateTime) {
    if (!hourFrom.isValid || !hourTo.isValid) {
      throw new DomainException({
        message: MessageCode.INVALID_HOURS,
      });
    }
    if (hourFrom > hourTo) {
      throw new DomainException({
        message: MessageCode.HOUR_FROM_GREATER_THAN_HOUR_TO,
      });
    }
  }

  equal(hours: HoursOfOperation) {
    const { hourFrom, hourTo } = OperationHours.parseHoursOfOperation(hours);
    return hourFrom.equals(this.hourFrom) && hourTo.equals(this.hourTo);
  }
  static parseHoursOfOperation({
    hourFrom: from,
    hourTo: to,
  }: HoursOfOperation) {
    return {
      hourFrom: DateTime.fromSQL(from),
      hourTo: DateTime.fromSQL(to),
    };
  }

  toPlainObject(): HoursOfOperation {
    return {
      hourFrom: this.parseTimeToHourAndMinute(this.hourFrom),
      hourTo: this.parseTimeToHourAndMinute(this.hourTo),
    };
  }

  parseTimeToHourAndMinute(hour: DateTime) {
    const [hours, minutes] = hour
      .toSQLTime({ includeOffset: false })
      .split('.')[0]
      .split(':');
    return `${hours}:${minutes}`;
  }
}
