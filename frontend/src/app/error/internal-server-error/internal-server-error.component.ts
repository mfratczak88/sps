import { Component } from '@angular/core';
import { ErrorKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-internal-server-error',
  templateUrl: './internal-server-error.component.html',
  styleUrls: ['./internal-server-error.component.scss'],
})
export class InternalServerErrorComponent {
  readonly translations = ErrorKeys;
}
