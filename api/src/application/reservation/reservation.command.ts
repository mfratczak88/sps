import { Id } from '../../domain/id';
import { IsNotEmpty } from 'class-validator';

export class CreateReservationCommand {
  @IsNotEmpty()
  parkingLotId: Id;

  @IsNotEmpty()
  licensePlate: string;

  @IsNotEmpty()
  start: string;

  @IsNotEmpty()
  end: string;
}
