import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateReservationComponent } from './create/create.component';
import { ReservationsRoutingModule } from './routing';
import { ReservationListComponent } from './list/list.component';
import { ReservationExpansionPanelComponent } from '../../shared/components/reservation-expansion-panel/reservation-expansion-panel.component';
import { ReservationDetailsComponent } from './details/details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ReservationsRoutingModule,
  ],
  declarations: [
    CreateReservationComponent,
    ReservationListComponent,
    ReservationExpansionPanelComponent,
    ReservationDetailsComponent,
  ],
})
export class ReservationsModule {}
