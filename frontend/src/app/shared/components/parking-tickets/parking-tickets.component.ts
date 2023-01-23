import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ParkingTicket,
  Reservation,
} from '../../../core/model/reservation.model';
import { ClerkKeys, DriverKeys } from '../../../core/translation-keys';

@Component({
  selector: 'sps-parking-tickets',
  templateUrl: './parking-tickets.component.html',
  styleUrls: ['./parking-tickets.component.scss'],
})
export class ParkingTicketsComponent {
  translations = { ...DriverKeys, ...ClerkKeys };

  @Input()
  editable = false;

  @Input()
  reservation: Reservation;

  @Output()
  issueTicket = new EventEmitter<void>();

  @Output()
  returnTicket = new EventEmitter<ParkingTicket>();
}
