import { Component } from '@angular/core';
import { AdminKeys } from '../../core/translation-keys';
import { AdminPaths } from '../../routes';

@Component({
  selector: 'sps-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  cardTranslations = AdminKeys;

  links = AdminPaths;
}
