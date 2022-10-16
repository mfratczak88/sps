import { Component } from '@angular/core';
import { AdminKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.scss'],
})
export class ParkingComponent {
  readonly translations = AdminKeys;
}
