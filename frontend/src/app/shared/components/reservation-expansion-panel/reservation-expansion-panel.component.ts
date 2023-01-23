import { Component, Input } from '@angular/core';
import { Reservation } from '../../../core/model/reservation.model';
import { DriverKeys } from '../../../core/translation-keys';

@Component({
  selector: 'sps-reservation-expansion-panel',
  templateUrl: './reservation-expansion-panel.component.html',
  styleUrls: ['./reservation-expansion-panel.component.scss'],
})
export class ReservationExpansionPanelComponent {
  translations = { ...DriverKeys };

  @Input()
  expanded = false;

  @Input()
  reservation: Reservation;
}
