import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const DASHBOARD_ROUTE = {
  path: '',
  component: DashboardComponent,
};
const routes = [DASHBOARD_ROUTE as Route];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClerkDashboardRoutingModule {}
