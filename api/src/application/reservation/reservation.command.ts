import { Id } from '../../domain/id';
import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationCommand {
  @IsNotEmpty()
  parkingLotId: Id;

  @IsNotEmpty()
  licensePlate: string;

  @IsDate()
  @Type(() => Date)
  start: Date;

  @IsDate()
  end: Date;
}

export class ChangeTimeCommand {
  @IsNotEmpty()
  reservationId: Id;

  @IsDate()
  @Type(() => Date)
  start: Date;

  @IsDate()
  @Type(() => Date)
  end: Date;
}
