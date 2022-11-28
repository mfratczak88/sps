import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopLevelPaths } from './routes';
import { AuthGuard } from './core/guards/auth.guard';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: AppComponent,
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
    path: TopLevelPaths.CLERK_DASHBOARD,
    loadChildren: () =>
      import('./clerk-dashboard/module').then(m => m.ClerkDashboardModule),
  },
  {
    path: TopLevelPaths.DRIVER_DASHBOARD,
    loadChildren: () =>
      import('./driver-dashboard/module').then(m => m.DriverDashboardModule),
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
