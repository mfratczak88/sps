import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AddressPipe } from '../core/pipe/address/address.pipe';
import { DaysPipe } from '../core/pipe/date/days.pipe';
import { HourPipe } from '../core/pipe/time/hour.pipe';
import { HoursPipe } from '../core/pipe/time/hours.pipe';
import { SpsReservationTimePipe } from '../core/pipe/time/reservation-time';
import { ToastService } from '../core/service/toast.service';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { CardComponent } from './components/card/card.component';
import { ChipComponent } from './components/chip/chip.component';
import { ConfirmActionDialogComponent } from './components/confirm-action-dialog/confirm-action-dialog.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { HeadingComponent } from './components/heading/heading.component';
import { HoursFormComponent } from './components/hours-form/hours-form.component';
import { LinkComponent } from './components/link/link.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NumberChipComponent } from './components/number-chip/number-chip.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PanelComponent } from './components/panel/panel.component';
import { ParkingLotExpansionPanelComponent } from './components/parking-lot-expansion-panel/parking-lot-expansion-panel.component';
import { ParkingLotsTableComponent } from './components/parking-lots-table/parking-lots-table.component';
import { ReservationsTableComponent } from './components/reservations-table/reservations-table.component';
import { TableComponent } from './components/table/table.component';
import { TextComponent } from './components/text/text.component';
import { TimeLeftComponent } from './components/time-left/time-left.component';
import { WeekdaysFormComponent } from './components/weekdays-form/weekdays-form.component';
import { MaterialModule } from './material.module';
import { MaterialToastService } from './service/material.toast.service';
import { PaginatorIntlService } from './service/paginator.intl.service';

import { MatDialog } from '@angular/material/dialog';
import { AbstractDialog } from '../core/abstract.dialog';
import { CanCancelReservationPipe } from '../core/pipe/can/can-cancel-reservation.pipe';
import { CanConfirmReservationPipe } from '../core/pipe/can/can-confirm-reservation.pipe';
import { CanEditReservationPipe } from '../core/pipe/can/can-edit-reservation.pipe';
import { CanIssueParkingTicketPipe } from '../core/pipe/can/can-issue-parking-ticket.pipe';
import { CanReturnParkingTicketPipe } from '../core/pipe/can/can-return-parking-ticket.pipe';
import { DatePipe } from '../core/pipe/date/date.pipe';
import { TimePipe } from '../core/pipe/time/time.pipe';
import { DriversTableComponent } from './components/drivers-table/drivers-table.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { ParkingTicketComponent } from './components/parking-ticket/parking-ticket.component';
import { ParkingTicketsComponent } from './components/parking-tickets/parking-tickets.component';
import { ReservationExpansionPanelComponent } from './components/reservation-expansion-panel/reservation-expansion-panel.component';
import { ReservationStatusChipComponent } from './components/reservation-status-chip/reservation-status-chip.component';
import { UsersTableComponent } from './components/users-table/users-table.component';

const components = [
  NavbarComponent,
  LinkComponent,
  HeadingComponent,
  TextComponent,
  FormErrorComponent,
  PageHeaderComponent,
  BreadcrumbsComponent,
  DrawerComponent,
  CardComponent,
  TableComponent,
  PanelComponent,
  ParkingLotsTableComponent,
  AddressPipe,
  HoursPipe,
  DaysPipe,
  HourPipe,
  HoursFormComponent,
  WeekdaysFormComponent,
  LoadingSpinnerComponent,
  NumberChipComponent,
  ParkingLotExpansionPanelComponent,
  ChipComponent,
  TimeLeftComponent,
  ConfirmActionDialogComponent,
  ReservationsTableComponent,
  ReservationStatusChipComponent,
  ReservationExpansionPanelComponent,
  SpsReservationTimePipe,
  DatePipe,
  TimePipe,
  CanIssueParkingTicketPipe,
  CanReturnParkingTicketPipe,
  CanConfirmReservationPipe,
  CanCancelReservationPipe,
  CanEditReservationPipe,
  PaginatorComponent,
  ParkingTicketComponent,
  ParkingTicketsComponent,
  UsersTableComponent,
  DriversTableComponent,
];
@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule.forChild(),
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [MaterialModule, TranslateModule, ...components],
  providers: [
    { provide: ToastService, useClass: MaterialToastService },
    { provide: AbstractDialog, useClass: MatDialog },
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService },
    SpsReservationTimePipe,
    DatePipe,
    CanConfirmReservationPipe,
    CanCancelReservationPipe,
    CanEditReservationPipe,
  ],
})
export class SharedModule {}
