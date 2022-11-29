import { RouterModule, Routes } from '@angular/router';
import { DrawerKeys } from '../../core/translation-keys';
import { DriverPaths } from '../../routes';
import { DASHBOARD_ROUTE } from '../routing';
import { NgModule } from '@angular/core';
import { VehiclesComponent } from './vehicles.component';

const routes: Routes = [
  {
    path: '',
    component: VehiclesComponent,
    data: {
      breadcrumbs: {
        label: DrawerKeys.VEHICLES,
        path: DriverPaths.VEHICLES,
        parent: DASHBOARD_ROUTE,
      },
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiclesRoutingModule {}
