import { Component } from '@angular/core';
import { RouterService } from '../core/state/router/router.service';
import { ErrorKeys } from '../core/translation-keys';

@Component({
  selector: 'sps-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  readonly translations = ErrorKeys;

  constructor(readonly navigationService: RouterService) {}
}
