import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParkingLotsRoutingModule } from './routing';
import { ParkingLotsListComponent } from './list/list.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [ParkingLotsListComponent],
  imports: [CommonModule, CoreModule, SharedModule, ParkingLotsRoutingModule],
})
export class ParkingLotsModule {}
