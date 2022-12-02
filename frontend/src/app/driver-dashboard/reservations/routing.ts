import { DriverPaths } from '../../routes';
import { DrawerKeys } from '../../core/translation-keys';
import { CreateReservationComponent } from './create/create.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReservationListComponent } from './list/list.component';
import { DASHBOARD_ROUTE } from '../routing';

const RESERVATIONS_LIST_ROUTE = {
  path: '',
  component: ReservationListComponent,
  data: {
    breadcrumbs: {
      label: DrawerKeys.RESERVATIONS,
      path: DriverPaths.RESERVATIONS,
      parent: DASHBOARD_ROUTE,
    },
  },
};
const CREATE_RESERVATION_ROUTE = {
  path: DriverPaths.CREATE_RESERVATION,
  component: CreateReservationComponent,
  data: {
    breadcrumbs: {
      label: DrawerKeys.CREATE_RESERVATION,
      path: DriverPaths.CREATE_RESERVATION,
      parent: RESERVATIONS_LIST_ROUTE,
    },
  },
};
const routes: Routes = [RESERVATIONS_LIST_ROUTE, CREATE_RESERVATION_ROUTE];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationsRoutingModule {}
