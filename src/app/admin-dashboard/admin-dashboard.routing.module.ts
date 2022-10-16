import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AuthGuard } from '../core/guards/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ParkingComponent } from './parking/parking.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { AdminDrawerKeys } from '../core/translation-keys';
import { AdminPaths } from '../routes';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        redirectTo: AdminPaths.DASHBOARD,
        pathMatch: 'full',
      },
      {
        path: AdminPaths.DASHBOARD,
        component: DashboardComponent,
        data: {
          breadcrumbs: {
            root: AdminDrawerKeys.DASHBOARD,
          },
        },
      },
      {
        path: AdminPaths.USERS,
        component: UsersComponent,
        data: {
          breadcrumbs: {
            root: AdminDrawerKeys.DASHBOARD,
            current: AdminDrawerKeys.USERS,
          },
        },
      },
      {
        path: AdminPaths.PARKING,
        component: ParkingComponent,
        data: {
          breadcrumbs: {
            root: AdminDrawerKeys.DASHBOARD,
            current: AdminDrawerKeys.PARKING,
          },
        },
      },
      {
        path: AdminPaths.RESERVATIONS,
        component: ReservationsComponent,
        data: {
          breadcrumbs: {
            root: AdminDrawerKeys.DASHBOARD,
            current: AdminDrawerKeys.RESERVATIONS,
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule {}
