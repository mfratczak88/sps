import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Id } from '../../domain/id';
import { Type } from 'class-transformer';
import { OperationTimeDays } from '../../domain/parking-lot/operation-time';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  streetName: string;

  @IsNotEmpty()
  @IsString()
  streetNumber: string;
}

export class HoursOfOperationDto {
  @Min(0)
  @Max(22)
  hourFrom: number;

  @Min(1)
  @Max(23)
  @IsNotEmpty()
  hourTo: number;

  @IsDate()
  @Type(() => Date)
  validFrom: Date;

  @IsNotEmpty()
  days: OperationTimeDays[];
}

export class CreateParkingLotCommand {
  @IsPositive()
  capacity: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => HoursOfOperationDto)
  hoursOfOperation: HoursOfOperationDto;
}

export class ChangeHoursOfOperationCommand {
  @IsNotEmpty()
  @IsString()
  parkingLotId: Id;

  @Min(0)
  @Max(22)
  hourFrom: number;

  @Min(1)
  @Max(23)
  @IsNotEmpty()
  hourTo: number;
}

export class ChangeCapacityCommand {
  @IsNotEmpty()
  @IsString()
  parkingLotId: Id;

  @IsPositive()
  capacity: number;
}
