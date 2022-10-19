import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleWithTranslation, User } from '../state/user.model';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { UserQuery } from '../state/user.query';
import { FormControl } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';

@Component({
  selector: 'sps-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrls: ['./edit-role-dialog.component.scss'],
})
export class EditRoleDialogComponent implements OnInit {
  translations = { ...AdminKeys, ...MiscKeys };

  rolesToChoose: RoleWithTranslation[] = [];

  selectedRole = new FormControl(null, [LocalizedValidators.required]);

  constructor(
    readonly dialogRef: MatDialogRef<EditRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: User,
    readonly userQuery: UserQuery,
  ) {}

  ngOnInit(): void {
    this.rolesToChoose = this.userQuery.roles.filter(
      ({ role }) => role !== this.data.role,
    );
  }

  onAssign() {
    this.dialogRef.close(this.selectedRole.value);
  }
}
