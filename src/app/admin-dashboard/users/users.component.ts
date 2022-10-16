import { Component } from '@angular/core';
import { AdminKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  readonly translations = AdminKeys;
}
