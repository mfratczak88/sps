import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LinkComponent } from './components/link/link.component';
import { HeadingComponent } from './components/heading/heading.component';
import { TextComponent } from './components/text/text.component';
import { ToastService } from '../core/service/toast.service';
import { MaterialToastService } from './service/material.toast.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { RouterModule } from '@angular/router';
import { CardComponent } from './components/card/card.component';
import { TableComponent } from './components/table/table.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntlService } from './service/paginator.intl.service';
import { PanelComponent } from './components/panel/panel.component';
import { ParkingLotsTableComponent } from './components/parking-lots-table/parking-lots-table.component';
import { AddressPipe } from './pipe/address/address.pipe';
import { HoursPipe } from './pipe/time/hours.pipe';
import { DaysPipe } from './pipe/date/days.pipe';
import { HourPipe } from './pipe/time/hour.pipe';
import { HoursFormComponent } from './components/hours-form/hours-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WeekdaysFormComponent } from './components/weekdays-form/weekdays-form.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NumberChipComponent } from './components/number-chip/number-chip.component';
import { ParkingLotExpansionPanelComponent } from './components/parking-lot-expansion-panel/parking-lot-expansion-panel.component';
import { ChipComponent } from './components/chip/chip.component';
import { TimeLeftComponent } from './components/time-left/time-left.component';
import { ConfirmActionDialogComponent } from './components/confirm-action-dialog/confirm-action-dialog.component';
import { ReservationsTableComponent } from './components/reservations-table/reservations-table.component';
import { TimePipe } from './pipe/time/time.pipe';

import { SyncTableComponent } from './components/sync-table/sync-table.component';
import { ReservationStatusChipComponent } from './components/reservation-status-chip/reservation-status-chip.component';
import { DatePipe } from './pipe/date/date.pipe';
import { CanCancelReservationPipe } from './pipe/can/can-cancel-reservation.pipe';
import { CanEditReservationPipe } from './pipe/can/can-edit-reservation.pipe';
import { CanConfirmReservationPipe } from './pipe/can/can-confirm-reservation.pipe';
import { ReservationExpansionPanelComponent } from './components/reservation-expansion-panel/reservation-expansion-panel.component';

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
  SyncTableComponent,
  ReservationStatusChipComponent,
  ReservationExpansionPanelComponent,
  TimePipe,
  DatePipe,
  CanConfirmReservationPipe,
  CanCancelReservationPipe,
  CanEditReservationPipe,
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
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService },
    TimePipe,
    DatePipe,
    CanConfirmReservationPipe,
    CanCancelReservationPipe,
    CanEditReservationPipe,
  ],
})
export class SharedModule {}
