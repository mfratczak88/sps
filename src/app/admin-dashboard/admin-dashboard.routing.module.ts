import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { AdminPaths } from '../app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ParkingComponent } from './parking/parking.component';

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
      },
      {
        path: AdminPaths.USERS,
        component: UsersComponent,
      },
      {
        path: AdminPaths.PARKING,
        component: ParkingComponent,
      },
      {
        path: AdminPaths.RESERVATIONS,
        component: ParkingComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule {}
