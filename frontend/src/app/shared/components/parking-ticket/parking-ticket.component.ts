import { Component, Input } from '@angular/core';
import { ParkingTicket } from '../../../core/model/reservation.model';
import { DriverKeys } from '../../../core/translation-keys';

@Component({
  selector: 'sps-parking-ticket',
  templateUrl: './parking-ticket.component.html',
  styleUrls: ['./parking-ticket.component.scss'],
})
export class ParkingTicketComponent {
  translations = DriverKeys;

  @Input()
  ticket: ParkingTicket;
}
