import { Id } from '../id';
import { Vehicle } from './vehicle';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';
import { Validate } from '../validate.decorator';
import { IsDefined, IsNotEmpty } from 'class-validator';

@Validate
export class Driver {
  @IsNotEmpty()
  readonly id: Id;
  @IsDefined()
  readonly vehicles: Vehicle[];
  @IsDefined()
  readonly assignedParkingLots: Id[];

  constructor(id: Id, vehicles: Vehicle[], assignedParkingLots: Id[]) {
    this.id = id;
    this.vehicles = vehicles || [];
    this.assignedParkingLots = assignedParkingLots || [];
  }

  addVehicle(licensePlate: string) {
    if (this.vehicles.find((v) => v.licensePlate === licensePlate)) {
      throw new DomainException({
        message: MessageCode.VEHICLE_ALREADY_REGISTERED,
      });
    }
    this.vehicles.push(new Vehicle(licensePlate));
  }

  assignParkingLot(parkingLotId: Id) {
    if (this.isParkingLotAssigned(parkingLotId)) {
      throw new DomainException({
        message: MessageCode.PARKING_LOT_ALREADY_ASSIGNED_TO_DRIVER,
      });
    }
    this.assignedParkingLots.push(parkingLotId);
  }

  removeLotAssignment(parkingLotId: Id) {
    if (!this.isParkingLotAssigned(parkingLotId)) {
      throw new DomainException({
        message: MessageCode.PARKING_LOT_NOT_ASSIGNED_TO_DRIVER,
      });
    }
    this.assignedParkingLots.splice(
      this.assignedParkingLots.indexOf(parkingLotId),
      1,
    );
  }

  isParkingLotAssigned(lotId: Id) {
    return !!this.assignedParkingLots.find((id) => id === lotId);
  }
}
