import { Id } from './id';
import { Address } from './address';
import { DomainException } from './domain.exception';
import { MessageCode } from '../message';
import { Validate } from './validate.decorator';
import { IsDefined, IsNotEmpty, IsPositive } from 'class-validator';

@Validate
export class ParkingLot {
  @IsNotEmpty()
  private readonly id: Id;

  @IsDefined()
  private readonly address: Address;

  @IsPositive()
  capacity: number;

  constructor(id: Id, address: Address, capacity: number) {
    this.id = id;
    this.address = address;
    this.capacity = capacity;
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

  hasCapacity(capacity: number) {
    return this.capacity === capacity;
  }

  hasId(id: Id) {
    return this.id === id;
  }
}
