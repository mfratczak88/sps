import { DriversListComponent } from './list/list.component';
import { DrawerKeys } from '../../core/translation-keys';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DASHBOARD_ROUTE } from '../routing';
import { AdminPaths } from '../../routes';
import { DriverDetailsComponent } from './details/details.component';

const DRIVERS_LIST_ROUTE = {
  path: '',
  component: DriversListComponent,
  data: {
    breadcrumbs: {
      label: DrawerKeys.DRIVERS,
      path: AdminPaths.DRIVERS,
      parent: DASHBOARD_ROUTE,
    },
  },
};
const DETAILS_ROUTE = {
  path: ':driverId',
  component: DriverDetailsComponent,
  data: {
    breadcrumbs: {
      label: DrawerKeys.PARKING_DETAILS,
      path: ':driverId',
      parent: DRIVERS_LIST_ROUTE,
    },
  },
};
@NgModule({
  imports: [RouterModule.forChild([DRIVERS_LIST_ROUTE, DETAILS_ROUTE])],
  exports: [RouterModule],
})
export class DriversRoutingModule {}
