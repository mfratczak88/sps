import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsListComponent } from './list/list.component';
import { SharedModule } from '../../shared/shared.module';
import { ReservationsRoutingModule } from './routing';

@NgModule({
  declarations: [ReservationsListComponent],
  imports: [CommonModule, ReservationsRoutingModule, SharedModule],
})
export class ReservationsModule {}
