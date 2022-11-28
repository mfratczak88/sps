import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ClerkDashboardRoutingModule } from './routing';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    ClerkDashboardRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ],
})
export class ClerkDashboardModule {}
