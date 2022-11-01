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

@NgModule({
  declarations: [
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
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule.forChild(),
    RouterModule,
  ],
  exports: [
    MaterialModule,
    TranslateModule,
    NavbarComponent,
    LinkComponent,
    HeadingComponent,
    TextComponent,
    FormErrorComponent,
    PageHeaderComponent,
    DrawerComponent,
    BreadcrumbsComponent,
    CardComponent,
    TableComponent,
    PanelComponent,
    ParkingLotsTableComponent,
  ],
  providers: [
    { provide: ToastService, useClass: MaterialToastService },
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService },
  ],
})
export class SharedModule {}
