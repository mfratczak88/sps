import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DASHBOARD_ROUTE } from '../routing';
import { ClerkPaths } from '../../routes';
import { DrawerKeys } from '../../core/translation-keys';
import { OperationsComponent } from './component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OperationsComponent,
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
