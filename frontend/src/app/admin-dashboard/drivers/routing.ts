import { DriversListComponent } from './list/list.component';
import { AdminDrawerKeys } from '../../core/translation-keys';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DASHBOARD_ROUTE } from '../routing';
import { AdminPaths } from '../../routes';

const DRIVERS_LIST_ROUTE = {
  path: '',
  component: DriversListComponent,
  data: {
    breadcrumbs: {
      label: AdminDrawerKeys.DRIVERS,
      path: AdminPaths.DRIVERS,
      parent: DASHBOARD_ROUTE,
    },
  },
};
@NgModule({
  imports: [RouterModule.forChild([DRIVERS_LIST_ROUTE])],
  exports: [RouterModule],
})
export class DriversRoutingModule {}
