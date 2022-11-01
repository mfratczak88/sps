import { DriverReadModel } from './driver.read-model';

export abstract class DriverFinder {
  abstract findAll(): Promise<DriverReadModel[]>;
}
