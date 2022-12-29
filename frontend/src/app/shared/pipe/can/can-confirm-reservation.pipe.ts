import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Reservation } from '../../../core/model/reservation.model';
import { isNowAfter, isNowBefore } from './time.util';

@Pipe({
  name: 'canConfirmReservation',
})
@Injectable()
export class CanConfirmReservationPipe implements PipeTransform {
  transform(reservation: Reservation): boolean {
    const { approvalTimeStart, approvalDeadLine } = reservation;
    return !!(
      approvalTimeStart &&
      isNowAfter(approvalTimeStart) &&
      approvalDeadLine &&
      isNowBefore(approvalDeadLine)
    );
  }
}
