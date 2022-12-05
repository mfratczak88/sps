import { Component } from '@angular/core';
import { DriverQuery } from '../../state/driver/driver.query';
import { DriverKeys, MiscKeys } from '../../../core/translation-keys';

@Component({
  selector: 'sps-driver-reservation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ReservationListComponent {
  translations = { ...DriverKeys, ...MiscKeys };

  constructor(readonly query: DriverQuery) {}
}
