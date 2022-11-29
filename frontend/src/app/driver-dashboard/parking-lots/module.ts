import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingLotsComponent } from './parking-lots.component';
import { ParkingLotsRoutingModule } from './routing';

@NgModule({
  declarations: [ParkingLotsComponent],
  imports: [CommonModule, ParkingLotsRoutingModule],
})
export class ParkingLotsModule {}
