import { Component } from '@angular/core';
import { NavigationService } from '../core/service/navigation.service';
import { ErrorKeys } from '../core/translation-keys';

@Component({
  selector: 'sps-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  readonly translations = ErrorKeys;

  constructor(readonly navigationService: NavigationService) {}
}
