import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';
import { AdminDashboardRoutingModule } from './routing';
import { PanelComponent } from './panel/panel.component';

@NgModule({
  declarations: [AdminDashboardComponent, PanelComponent],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ],
})
export class AdminDashboardModule {}
