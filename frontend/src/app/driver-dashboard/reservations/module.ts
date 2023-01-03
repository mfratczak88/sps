import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateReservationComponent } from './create/create.component';
import { ReservationsRoutingModule } from './routing';
import { ReservationListComponent } from './list/list.component';
import { ReservationDetailsComponent } from './details/details.component';
import { EditTimeDialogComponent } from './edit-time-dialog/edit-time-dialog.component';

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
    ReservationDetailsComponent,
    EditTimeDialogComponent,
  ],
})
export class ReservationsModule {}
