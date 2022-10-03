import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export enum TopLevelPaths {
  AUTH = 'auth',
  ADMIN_DASHBOARD = 'admin-dashboard',
}
export enum AuthPaths {
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
}
const routes: Routes = [
  {
    path: '',
    redirectTo: TopLevelPaths.ADMIN_DASHBOARD,
    pathMatch: 'full',
  },
  {
    path: TopLevelPaths.AUTH,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: TopLevelPaths.ADMIN_DASHBOARD,
    loadChildren: () =>
      import('./admin-dashboard/admin-dashboard.module').then(
        m => m.AdminDashboardModule,
      ),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
