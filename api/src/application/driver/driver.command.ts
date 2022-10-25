import { Id } from '../../domain/id';
import { IsNotEmpty } from 'class-validator';

export class AddVehicleCommand {
  @IsNotEmpty()
  driverId: Id;
  @IsNotEmpty()
  licensePlate: string;
}
export class AssignParkingLotCommand {
  @IsNotEmpty()
  driverId: string;

  @IsNotEmpty()
  parkingLotId: string;
}

export class RemoveParkingLotAssignmentCommand {
  @IsNotEmpty()
  driverId: string;

  @IsNotEmpty()
  parkingLotId: string;
}
