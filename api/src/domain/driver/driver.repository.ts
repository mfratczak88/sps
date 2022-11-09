import { Driver } from './driver';
import { Id } from '../id';

export abstract class DriverRepository {
  abstract findByIdOrThrow(id: Id): Promise<Driver>;
  abstract save(driver: Driver): Promise<void>;
}
