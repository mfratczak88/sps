import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';

const DASHBOARD_ROUTE: Route = {
  path: '',
  component: DashboardComponent,
  pathMatch: 'full',
};
const routes = [DASHBOARD_ROUTE];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverDashboardRoutingModule {}
