import { Id } from '../id';
import { Reservation } from './reservation';

export abstract class ReservationRepository {
  abstract findByIdOrThrow(reservationId: Id): Promise<Reservation>;
  abstract findForLotInDate(lotId: Id, date: string): Promise<Reservation[]>;
}
