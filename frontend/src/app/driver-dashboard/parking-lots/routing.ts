import { RouterModule, Routes } from '@angular/router';
import { DrawerKeys } from '../../core/translation-keys';
import { DriverPaths } from '../../routes';
import { DASHBOARD_ROUTE } from '../routing';
import { NgModule } from '@angular/core';
import { ParkingLotsListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ParkingLotsListComponent,
    data: {
      breadcrumbs: {
        label: DrawerKeys.PARKING,
        path: DriverPaths.PARKING_LOTS,
        parent: DASHBOARD_ROUTE,
      },
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParkingLotsRoutingModule {}
