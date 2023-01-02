import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './list/list.component';
import { EditRoleDialogComponent } from './edit-role-dialog/edit-role-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { UsersRoutingModule } from './routing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { UsersState } from './store/users.state';

@NgModule({
  declarations: [UsersListComponent, EditRoleDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxsModule.forFeature([UsersState]),
    ReactiveFormsModule,
    UsersRoutingModule,
  ],
})
export class UsersModule {}
