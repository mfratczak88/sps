import { Component } from '@angular/core';

import { ErrorKeys } from '../core/translation-keys';

@Component({
  selector: 'sps-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  readonly translations = ErrorKeys;
}
