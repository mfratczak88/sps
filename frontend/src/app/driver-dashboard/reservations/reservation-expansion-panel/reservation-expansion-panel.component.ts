import { Component, Input } from '@angular/core';
import { Reservation } from '../../../core/model/reservation.model';

@Component({
  selector: 'sps-reservation-expansion-panel',
  templateUrl: './reservation-expansion-panel.component.html',
  styleUrls: ['./reservation-expansion-panel.component.scss'],
})
export class ReservationExpansionPanelComponent {
  @Input()
  expanded = false;

  @Input()
  reservation: Reservation;
}
