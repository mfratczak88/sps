import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { AdminDashboardRoutingModule } from './admin-dashboard.routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ParkingComponent } from './parking/parking.component';
import { EditRoleDialogComponent } from './users/edit-role-dialog/edit-role-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailsComponent } from './parking/details/details.component';
import { CreateComponent } from './parking/create/create.component';
import { ChangeHoursDialogComponent } from './parking/change-hours-dialog/change-hours-dialog.component';
import { ChangeCapacityDialogComponent } from './parking/change-capacity-dialog/change-capacity-dialog.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    DashboardComponent,
    UsersComponent,
    ReservationsComponent,
    ParkingComponent,
    EditRoleDialogComponent,
    DetailsComponent,
    CreateComponent,
    ChangeHoursDialogComponent,
    ChangeCapacityDialogComponent,
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ],
})
export class AdminDashboardModule {}
