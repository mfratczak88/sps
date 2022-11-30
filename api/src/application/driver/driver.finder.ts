import { DriverReadModel } from './driver.read-model';
import { Id } from '../../domain/id';

export abstract class DriverFinder {
  abstract findAll(): Promise<DriverReadModel[]>;
  abstract findById(id: Id): Promise<DriverReadModel>;
}
