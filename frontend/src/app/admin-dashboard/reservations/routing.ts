import { Route, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AdminDrawerKeys } from '../../core/translation-keys';
import { AdminPaths, TopLevelPaths } from '../../routes';

import { NgModule } from '@angular/core';
import { DASHBOARD_ROUTE } from '../routing';

const LIST_ROUTE: Route = {
  path: '',
  component: ListComponent,
  data: {
    breadcrumbs: {
      label: AdminDrawerKeys.RESERVATIONS,
      path: AdminPaths.RESERVATIONS,
      parent: DASHBOARD_ROUTE,
    },
  },
};
@NgModule({
  imports: [RouterModule.forChild([LIST_ROUTE])],
  exports: [RouterModule],
})
export class ReservationsRoutingModule {}
