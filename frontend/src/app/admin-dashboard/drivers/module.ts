import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversListComponent } from './list/list.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { DriversRoutingModule } from './routing';
import { DriverDetailsComponent } from './details/details.component';
import { AssignParkingLotDialogComponent } from './assign-parking-lot-dialog/assign-parking-lot-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DriversListComponent,
    DriverDetailsComponent,
    AssignParkingLotDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    DriversRoutingModule,
  ],
})
export class DriversModule {}
