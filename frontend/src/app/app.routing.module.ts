import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopLevelPaths } from './routes';

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
      import('./admin-dashboard/module').then(m => m.AdminDashboardModule),
  },
  {
    path: TopLevelPaths.ERROR,
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule),
  },
  {
    path: '**',
    redirectTo: TopLevelPaths.ERROR,
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
