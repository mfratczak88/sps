import { Id } from './id';
import { Address } from './address';
import { DomainException } from './domain.exception';
import { MessageCode } from '../message';
import { Validate } from './validate.decorator';
import { IsDefined, IsNotEmpty, IsPositive } from 'class-validator';

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
    return {
      hourFrom: this.operationHours.hourFrom,
      hourTo: this.operationHours.hourTo,
      minuteFrom: this.operationHours.minuteFrom,
      minuteTo: this.operationHours.minuteTo,
    };
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
  hourFrom: number;
  hourTo: number;
  minuteFrom?: number;
  minuteTo?: number;
}
@Validate
class OperationHours {
  readonly hourFrom: number;
  readonly hourTo: number;
  readonly minuteFrom?: number;
  readonly minuteTo?: number;

  constructor({ hourFrom, hourTo, minuteFrom, minuteTo }: HoursOfOperation) {
    this.validateHours(hourFrom, hourTo);
    this.hourFrom = hourFrom;
    this.hourTo = hourTo;
    this.minuteFrom = minuteFrom || 0;
    this.minuteTo = minuteTo || 0;
  }

  change(hours: HoursOfOperation) {
    return new OperationHours(hours);
  }

  private validateHours(hourFrom: number, hourTo: number) {
    if (hourFrom < 0 || hourFrom > 24 || hourTo < 0 || hourTo > 24) {
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
    const { hourTo, hourFrom, minuteFrom, minuteTo } = hours;
    return (
      hourTo === this.hourTo &&
      hourFrom === this.hourFrom &&
      (minuteTo || 0) === this.minuteTo &&
      (minuteFrom || 0) === this.minuteFrom
    );
  }
}
