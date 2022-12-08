import {
  ReservationQuery,
  ReservationReadModel,
  ReservationsReadModel,
} from './reservation.read-model';
import { Id } from '../../domain/id';

export abstract class ReservationFinder {
  abstract findAll(query: ReservationQuery): Promise<ReservationsReadModel>;
  abstract findById(id: Id): Promise<ReservationReadModel>;
}
