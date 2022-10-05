import { Component } from '@angular/core';
import { NavigationService } from '../core/service/navigation.service';

@Component({
  selector: 'sps-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  constructor(readonly navigationService: NavigationService) {}
}
