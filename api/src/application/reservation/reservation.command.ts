import { Id } from '../../domain/id';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationCommand {
  @IsNotEmpty()
  @IsString()
  parkingLotId: Id;

  @IsNotEmpty()
  @IsString()
  licensePlate: string;

  @IsDate()
  @Type(() => Date)
  start: Date;

  @IsDate()
  @Type(() => Date)
  end: Date;
}

export class ChangeTimeCommand {
  @IsNotEmpty()
  @IsString()
  reservationId: Id;

  @IsDate()
  @Type(() => Date)
  start: Date;

  @IsDate()
  @Type(() => Date)
  end: Date;
}
