import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ParkingRoutingModule } from './routing';
import { DetailsComponent } from './details/details.component';
import { CreateComponent } from './create/create.component';
import { ChangeHoursDialogComponent } from './change-hours-dialog/change-hours-dialog.component';
import { ChangeCapacityDialogComponent } from './change-capacity-dialog/change-capacity-dialog.component';

import { ParkingListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ParkingRoutingModule,
  ],
  declarations: [
    DetailsComponent,
    CreateComponent,
    ChangeHoursDialogComponent,
    ChangeCapacityDialogComponent,

    ParkingListComponent,
  ],
})
export class ParkingModule {}
