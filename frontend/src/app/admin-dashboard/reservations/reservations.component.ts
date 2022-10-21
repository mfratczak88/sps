import { Component } from '@angular/core';
import { AdminKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent {
  readonly translations = AdminKeys;
}
