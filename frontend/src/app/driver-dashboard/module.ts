import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { DriverDashboardRoutingModule } from './routing';
import { ReservationsComponent } from './reservations/reservations.component';
import { CreateReservationComponent } from './reservations/create/create.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ReservationsComponent,
    CreateReservationComponent,
  ],
  imports: [
    DriverDashboardRoutingModule,
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ],
})
export class DriverDashboardModule {}
