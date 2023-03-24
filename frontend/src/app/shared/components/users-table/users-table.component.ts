import { Component } from '@angular/core';
import { AdminKeys } from 'src/app/core/translation-keys';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'sps-users-table',
  templateUrl: '../table/table.component.html',
  styleUrls: ['./users-table.component.scss', '../table/table.component.scss'],
})
export class UsersTableComponent extends TableComponent {
  readonly usersTranslations = AdminKeys;

  constructor() {
    super();
    this.columns = [
      { name: 'email', translation: this.usersTranslations.COLUMN_EMAIL },
      { name: 'name', translation: this.usersTranslations.COLUMN_NAME },
      {
        name: 'roleTranslation',
        translation: this.usersTranslations.COLUMN_ROLE,
      },
    ];
  }
}
