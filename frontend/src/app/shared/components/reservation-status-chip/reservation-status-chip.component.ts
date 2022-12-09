import { Component, Input } from '@angular/core';
import {
  Reservation,
  ReservationStatus,
  ReservationStatusTranslationKey,
} from '../../../core/model/reservation.model';

@Component({
  selector: 'sps-reservation-status-chip',
  templateUrl: './reservation-status-chip.component.html',
  styleUrls: ['./reservation-status-chip.component.scss'],
})
export class ReservationStatusChipComponent {
  @Input()
  reservation: Reservation;

  cssClass() {
    return this.reservation.status === ReservationStatus.DRAFT
      ? 'color-grey'
      : ReservationStatus.ACCEPTED
      ? 'color-green'
      : 'color-red';
  }

  translation() {
    return ReservationStatusTranslationKey[this.reservation.status];
  }
}
