import { AdminPaths } from '../../routes';
import { AdminDrawerKeys } from '../../core/translation-keys';
import { DetailsComponent } from './details/details.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParkingListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { DASHBOARD_ROUTE } from '../routing';

const PARKING_LOT_LIST_ROUTE = {
  path: '',
  component: ParkingListComponent,
  data: {
    breadcrumbs: {
      label: AdminDrawerKeys.PARKING,
      path: AdminPaths.PARKING,
      parent: DASHBOARD_ROUTE,
    },
  },
};
const CREATE_PARKING_ROUTE = {
  path: AdminPaths.CREATE_PARKING,
  component: CreateComponent,
  data: {
    breadcrumbs: {
      label: AdminDrawerKeys.PARKING,
      path: AdminPaths.PARKING,
      parent: PARKING_LOT_LIST_ROUTE,
    },
  },
};
const DETAILS_ROUTE = {
  path: ':parkingLotId',
  component: DetailsComponent,
  data: {
    breadcrumbs: {
      label: AdminDrawerKeys.PARKING_DETAILS,
      path: ':parkingLotId',
      parent: PARKING_LOT_LIST_ROUTE,
    },
  },
};

@NgModule({
  imports: [
    RouterModule.forChild([
      CREATE_PARKING_ROUTE,
      PARKING_LOT_LIST_ROUTE,
      DETAILS_ROUTE,
    ]),
  ],
  exports: [RouterModule],
})
export class ParkingRoutingModule {}
