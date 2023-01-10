import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Reservation } from '../../model/reservation.model';
import { isNowAfter, isNowBefore } from '../../util';

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
