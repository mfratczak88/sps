import { Component } from '@angular/core';
import { DriverQuery } from '../../state/driver/driver.query';
import { DriverService } from '../../state/driver/driver.service';
import { DriverKeys } from '../../../core/translation-keys';

@Component({
  selector: 'sps-driver-parking-lot-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ParkingLotsListComponent {
  translations = { ...DriverKeys };

  constructor(readonly query: DriverQuery, readonly service: DriverService) {}
}
