import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehicleSearchComponent } from './vehicle-search/vehicle-search.component';
import { DASHBOARD_ROUTE } from '../routing';
import { ClerkPaths } from '../../routes';
import { DrawerKeys } from '../../core/translation-keys';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: VehicleSearchComponent,
        pathMatch: 'full',
        data: {
          breadcrumbs: {
            path: ClerkPaths.OPERATIONS,
            label: DrawerKeys.OPERATIONS,
            parent: DASHBOARD_ROUTE,
          },
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class OperationsRoutingModule {}
