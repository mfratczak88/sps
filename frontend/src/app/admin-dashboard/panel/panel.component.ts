import { Component } from '@angular/core';
import { AdminKeys } from '../../core/translation-keys';
import { AdminPaths } from '../../routes';

@Component({
  selector: 'sps-admin-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent {
  translations = AdminKeys;

  links = AdminPaths;
}
