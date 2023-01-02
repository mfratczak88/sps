import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleWithTranslation, User } from '../../../core/model/user.model';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { FormControl } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';
import { Store } from '@ngxs/store';
import { roles } from '../store/users.selector';

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
    readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.rolesToChoose = this.store
      .selectSnapshot(roles)
      .filter(({ role }) => role !== this.data.role);
  }

  onAssign() {
    this.dialogRef.close(this.selectedRole.value);
  }
}
