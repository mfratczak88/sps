import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ClerkDashboardRoutingModule } from './routing';
import { NgxsModule } from '@ngxs/store';
import { VehicleSearchState } from './store/vehicles-search.state';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    ClerkDashboardRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    NgxsModule.forFeature([VehicleSearchState]),
  ],
})
export class ClerkDashboardModule {}
