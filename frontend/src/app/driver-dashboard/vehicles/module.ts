import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesComponent } from './vehicles.component';
import { VehiclesRoutingModule } from './routing';
import { SharedModule } from '../../shared/shared.module';
import { AddVehicleDialogComponent } from './add-vehicle-dialog/add-vehicle-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [VehiclesComponent, AddVehicleDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    VehiclesRoutingModule,
    ReactiveFormsModule,
  ],
})
export class VehiclesModule {}
