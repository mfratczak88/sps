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
import { AddressPipe } from './pipe/address.pipe';
import { HoursPipe } from './pipe/hours.pipe';
import { DaysPipe } from './pipe/days.pipe';
import { HourPipe } from './pipe/hour.pipe';
import { HoursFormComponent } from './components/hours-form/hours-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WeekdaysFormComponent } from './components/weekdays-form/weekdays-form.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NumberChipComponent } from './components/number-chip/number-chip.component';
import { ParkingLotExpansionPanelComponent } from './components/parking-lot-expansion-panel/parking-lot-expansion-panel.component';

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
  ],
})
export class SharedModule {}
