import { DriverQuery, DriverReadModel } from './driver.read-model';
import { Id } from '../../domain/id';
import { Vehicle } from '../../domain/driver/vehicle';

export abstract class DriverFinder {
  abstract findAll(): Promise<DriverReadModel[]>;
  abstract findSingle(
    driverId: Id,
    query: DriverQuery,
  ): Promise<DriverReadModel>;
  abstract findAllVehicles(): Promise<Vehicle[]>;
}
