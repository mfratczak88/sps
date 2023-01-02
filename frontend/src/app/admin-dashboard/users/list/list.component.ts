import { Component, OnInit } from '@angular/core';
import { AdminKeys } from '../../../core/translation-keys';
import {
  Button,
  Column,
} from '../../../shared/components/table/table.component';
import { User } from '../../../core/model/user.model';

import { MatDialog } from '@angular/material/dialog';
import { EditRoleDialogComponent } from '../edit-role-dialog/edit-role-dialog.component';
import { concatMap, filter } from 'rxjs';
import { Role } from '../../../core/model/auth.model';
import { Store } from '@ngxs/store';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import { loading, users } from '../store/users.selector';

@Component({
  selector: 'sps-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class UsersListComponent implements OnInit {
  readonly translations = AdminKeys;

  readonly loading$ = this.store.select(loading);

  readonly users$ = this.store.select(users);

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

  constructor(readonly dialog: MatDialog, private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new AdminActions.GetAllUsers());
  }

  editDialogOpen(user: User) {
    const { id } = user;
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
          this.store.dispatch(
            new AdminActions.ChangeUserRole(id, newRole as Role),
          ),
        ),
      )
      .subscribe();
  }
}
