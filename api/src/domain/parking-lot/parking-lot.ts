import { Id } from '../id';
import { Address } from './address';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';
import { Validate } from '../validate.decorator';
import { IsDefined, IsNotEmpty, IsPositive } from 'class-validator';
import { OperationTime, OperationHours } from './operation-time';

@Validate
export class ParkingLot {
  @IsNotEmpty()
  readonly id: Id;

  @IsDefined()
  readonly address: Address;

  @IsPositive()
  private capacity: number;

  private operationTime: OperationTime;

  constructor(
    id: Id,
    address: Address,
    capacity: number,
    operatingTime: OperationTime,
  ) {
    this.id = id;
    this.address = address;
    this.capacity = capacity;
    this.operationTime = operatingTime;
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

  changeOperationHours(hours: OperationHours) {
    this.operationTime = this.operationTime.changeHours(hours);
  }

  openForParkingAt(start: Date, end: Date) {
    return this.operationTime.withinOperationHours(start, end);
  }

  plain() {
    return {
      id: this.id,
      ...this.address,
      capacity: this.capacity,
      timeOfOperation: this.operationTime.plain(),
    };
  }

  hasCapacity(capacity: number) {
    return this.capacity === capacity;
  }

  hasId(id: Id) {
    return this.id === id;
  }
}
