import {
  IsDefined,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Id } from '../../domain/id';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  streetName: string;

  @IsNotEmpty()
  streetNumber: string;
}

export class HoursOfOperationDto {
  @IsNotEmpty()
  hourFrom: string;

  @IsNotEmpty()
  hourTo: string;
}

export class CreateParkingLotCommand {
  @IsPositive()
  capacity: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsDefined()
  hoursOfOperation: HoursOfOperationDto;
}

export class ChangeHoursOfOperationCommand {
  @IsNotEmpty()
  parkingLotId: Id;

  @IsDefined()
  hoursOfOperation: HoursOfOperationDto;
}

export class ChangeCapacityCommand {
  @IsNotEmpty()
  parkingLotId: Id;

  @IsPositive()
  capacity: number;
}
