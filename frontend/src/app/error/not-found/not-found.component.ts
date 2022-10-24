import { Component } from '@angular/core';
import { ErrorKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  readonly translations = ErrorKeys;
}
