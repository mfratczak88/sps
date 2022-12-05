import { ReservationReadModel } from './reservation.read-model';
import { Id } from '../../domain/id';

export abstract class ReservationFinder {
  abstract findAll(query: ReservationQuery): Promise<ReservationReadModel[]>;
}

export class ReservationQuery {
  driverId?: Id;
}
