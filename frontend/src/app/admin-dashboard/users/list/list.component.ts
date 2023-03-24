import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/model/user.model';
import { AdminKeys } from '../../../core/translation-keys';
import { Button } from '../../../shared/components/table/table.component';

import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { concatMap, filter } from 'rxjs';
import { Role } from '../../../core/model/auth.model';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import { EditRoleDialogComponent } from '../edit-role-dialog/edit-role-dialog.component';
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
        filter((newRole) => !!newRole),
        concatMap((newRole) =>
          this.store.dispatch(
            new AdminActions.ChangeUserRole(id, newRole as Role),
          ),
        ),
      )
      .subscribe();
  }
}
