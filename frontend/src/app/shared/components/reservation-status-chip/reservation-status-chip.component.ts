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

  translation() {
    return ReservationStatusTranslationKey[this.reservation.status];
  }

  readonly statusCssClass = {
    [ReservationStatus.DRAFT]: 'color-grey',
    [ReservationStatus.CANCELLED]: 'color-red',
    [ReservationStatus.CONFIRMED]: 'color-green',
  };

  readonly statusIcon = {
    [ReservationStatus.CONFIRMED]: 'check_circle',
    [ReservationStatus.CANCELLED]: 'cancel',
    [ReservationStatus.DRAFT]: 'draft',
  };
}
