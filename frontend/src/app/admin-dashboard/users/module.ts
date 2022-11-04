import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './list/list.component';
import { EditRoleDialogComponent } from './edit-role-dialog/edit-role-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { UsersRoutingModule } from './routing';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsersListComponent, EditRoleDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    UsersRoutingModule,
  ],
})
export class UsersModule {}
