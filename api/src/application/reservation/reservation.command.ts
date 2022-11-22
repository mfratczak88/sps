import { Id } from '../../domain/id';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateReservationCommand {
  @IsNotEmpty()
  parkingLotId: Id;

  @IsNotEmpty()
  licensePlate: string;

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;
}

export class ChangeTimeCommand {
  @IsNotEmpty()
  reservationId: Id;

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;
}
