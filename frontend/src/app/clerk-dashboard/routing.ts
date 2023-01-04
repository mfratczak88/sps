import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './component';
import { ClerkPaths, TopLevelPaths } from '../routes';
import { AuthGuard } from '../core/guards/auth.guard';
import { ClerkGuard } from '../core/guards/role.guard';
import { DrawerKeys } from '../core/translation-keys';

export const DASHBOARD_ROUTE: Route = {
  path: '',
  component: DashboardComponent,
  canActivate: [AuthGuard, ClerkGuard],
  data: {
    breadcrumbs: {
      path: '/' + TopLevelPaths.CLERK_DASHBOARD,
      label: DrawerKeys.DASHBOARD,
    },
  },
  children: [
    {
      path: '',
      redirectTo: ClerkPaths.OPERATIONS,
      pathMatch: 'full',
    },
    {
      path: ClerkPaths.OPERATIONS,
      loadChildren: () =>
        import('./operations/module').then(m => m.OperationsModule),
    },
  ],
};
const routes = [DASHBOARD_ROUTE as Route];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClerkDashboardRoutingModule {}
