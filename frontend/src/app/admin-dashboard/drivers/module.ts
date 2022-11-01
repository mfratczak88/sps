import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversListComponent } from './list/list.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { DriversRoutingModule } from './routing';

@NgModule({
  declarations: [DriversListComponent],
  imports: [CommonModule, SharedModule, CoreModule, DriversRoutingModule],
})
export class DriversModule {}
