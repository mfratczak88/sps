import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { Id } from '../../domain/id';

export class CreateParkingLotCommand {
  @IsPositive()
  capacity: number;
  @IsDefined()
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
  minuteTo?: number;
}
export class AddressDto {
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  streetName: string;
  @IsNotEmpty()
  streetNumber: string;
}
