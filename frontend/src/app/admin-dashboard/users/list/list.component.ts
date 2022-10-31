import { Component, OnInit } from '@angular/core';
import { AdminKeys } from '../../../core/translation-keys';
import {
  Button,
  Column,
} from '../../../shared/components/table/table.component';
import { Role, User } from '../state/user.model';
import { UserQuery } from '../state/user.query';
import { UserService } from '../state/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditRoleDialogComponent } from '../edit-role-dialog/edit-role-dialog.component';
import { concatMap, filter } from 'rxjs';

@Component({
  selector: 'sps-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  readonly translations = AdminKeys;

  tableColumns: Column[] = [
    { name: 'email', translation: this.translations.COLUMN_EMAIL },
    { name: 'name', translation: this.translations.COLUMN_NAME },
    { name: 'roleTranslation', translation: this.translations.COLUMN_ROLE },
  ];

  tableButtons: Button[] = [
    {
      name: 'edit',
      translation: this.translations.COLUMN_EDIT,
      icon: 'edit',
      onClick: (user: User) => {
        this.editDialogOpen(user);
      },
    },
  ];

  constructor(
    readonly usersQuery: UserQuery,
    private readonly usersService: UserService,
    public dialog: MatDialog,
  ) {}

  editDialogOpen(user: User) {
    const dialogRef = this.dialog.open<EditRoleDialogComponent, User, Role>(
      EditRoleDialogComponent,
      {
        data: user,
      },
    );
    dialogRef
      .afterClosed()
      .pipe(
        filter(newRole => !!newRole),
        concatMap(newRole =>
          this.usersService.changeRoleFor(user.id, newRole as Role),
        ),
      )
      .subscribe();
  }
}
