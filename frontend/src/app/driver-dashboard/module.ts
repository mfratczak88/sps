import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { DriverDashboardRoutingModule } from './routing';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    DriverDashboardRoutingModule,
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    CountdownModule,
  ],
})
export class DriverDashboardModule {}