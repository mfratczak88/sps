import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './component';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../core/guards/auth.guard';
import { DriverGuard } from '../core/guards/role.guard';
import { DrawerKeys } from '../core/translation-keys';
import { DriverPaths, TopLevelPaths } from '../routes';
import { ReservationsComponent } from './reservations/reservations.component';
import { CreateReservationComponent } from './reservations/create/create.component';

export const DASHBOARD_ROUTE: Route = {
  path: '',
  component: DashboardComponent,
  canActivate: [AuthGuard, DriverGuard],
  runGuardsAndResolvers: 'always',
  data: {
    breadcrumbs: {
      label: DrawerKeys.DASHBOARD,
      path: '/' + TopLevelPaths.DRIVER_DASHBOARD,
    },
  },
  children: [
    {
      path: '',
      redirectTo: DriverPaths.RESERVATIONS,
      pathMatch: 'full',
    },
    {
      path: DriverPaths.RESERVATIONS,
      component: ReservationsComponent,
      data: {
        breadcrumbs: {
          label: DrawerKeys.RESERVATIONS,
          path: '/' + TopLevelPaths.DRIVER_DASHBOARD,
        },
      },
    },
    {
      path: DriverPaths.CREATE_RESERVATION,
      component: CreateReservationComponent,
      data: {
        breadcrumbs: {
          label: DrawerKeys.CREATE_RESERVATION,
          path: '/' + TopLevelPaths.DRIVER_DASHBOARD,
        },
      },
    },
    {
      path: DriverPaths.VEHICLES,
      loadChildren: () =>
        import('./vehicles/module').then(m => m.VehiclesModule),
    },
    {
      path: DriverPaths.PARKING_LOTS,
      loadChildren: () =>
        import('./parking-lots/module').then(m => m.ParkingLotsModule),
    },
  ],
};
const routes = [DASHBOARD_ROUTE];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverDashboardRoutingModule {}
