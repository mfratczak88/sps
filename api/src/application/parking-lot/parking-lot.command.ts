import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Max,
  Min,
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
  @Min(0)
  @Max(24)
  hourFrom: number;
  @Min(0)
  @Max(24)
  hourTo: number;
  @IsOptional()
  @IsPositive()
  minuteFrom?: number;
  @IsPositive()
  @IsOptional()
  minuteTo?: number;
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
