import { Id } from '../id';
import { Address } from './address';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';
import { Validate } from '../validate.decorator';
import { IsDefined, IsNotEmpty, IsPositive } from 'class-validator';
import { OperationHoursPlain, OperationHours } from './operation-hours';

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
    operationHours: OperationHoursPlain,
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

  changeOperationHours(hours: OperationHoursPlain) {
    this.operationHours = this.operationHours.change(hours);
  }

  get hoursOfOperation(): OperationHoursPlain {
    return this.operationHours.toPlain();
  }

  open(hours: OperationHoursPlain) {
    return this.operationHours.equal(hours);
  }

  hasCapacity(capacity: number) {
    return this.capacity === capacity;
  }

  hasId(id: Id) {
    return this.id === id;
  }
}
