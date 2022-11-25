import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AuthGuard } from '../core/guards/auth.guard';

import { AdminDrawerKeys } from '../core/translation-keys';
import { AdminPaths, TopLevelPaths } from '../routes';
import { PanelComponent } from './panel/panel.component';
import { AdminGuard } from '../core/guards/role.guard';

export const DASHBOARD_ROUTE = {
  path: '',
  component: AdminDashboardComponent,
  canActivate: [AuthGuard, AdminGuard],
  runGuardsAndResolvers: 'always',
  data: {
    breadcrumbs: {
      label: AdminDrawerKeys.DASHBOARD,
      path: '/' + TopLevelPaths.ADMIN_DASHBOARD,
    },
  },
  children: [
    {
      path: '',
      redirectTo: AdminPaths.DASHBOARD,
      pathMatch: 'full',
    },
    {
      path: AdminPaths.DASHBOARD,
      component: PanelComponent,
      data: {
        breadcrumbs: {
          label: AdminDrawerKeys.DASHBOARD,
          path: '/' + TopLevelPaths.ADMIN_DASHBOARD,
        },
      },
    },
    {
      path: AdminPaths.USERS,
      loadChildren: () => import('./users/module').then(m => m.UsersModule),
    },
    {
      path: AdminPaths.PARKING,
      loadChildren: () => import('./parking/module').then(m => m.ParkingModule),
    },
    {
      path: AdminPaths.RESERVATIONS,
      loadChildren: () =>
        import('./reservations/module').then(m => m.ReservationsModule),
    },
    {
      path: AdminPaths.DRIVERS,
      loadChildren: () => import('./drivers/module').then(m => m.DriversModule),
    },
  ],
};
const routes: Routes = [DASHBOARD_ROUTE as Route];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule {}
