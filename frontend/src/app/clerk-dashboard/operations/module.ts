import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleSearchComponent } from './vehicle-search/vehicle-search.component';
import { SharedModule } from '../../shared/shared.module';
import { OperationsRoutingModule } from './routing';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [VehicleSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    OperationsRoutingModule,
    ReactiveFormsModule,
  ],
})
export class OperationsModule {}
