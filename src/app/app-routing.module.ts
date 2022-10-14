import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum TopLevelPaths {
  AUTH = 'auth',
  ADMIN_DASHBOARD = 'admin-dashboard',
  ERROR = 'error',
}
export enum AuthPaths {
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
  FORGOT_PASSWORD = 'forgot-password',
  INVALID_AUTH_LINK = 'invalid-auth-link',
  ACTION_CODE = 'action-code',
}
export enum ErrorPaths {
  NOT_FOUND = 'not-found',
  INTERNAL_SERVER_ERROR = 'internal-server-error',
}
export enum AdminPaths {
  DASHBOARD = 'dashboard',
  USERS = 'users',
  PARKING = 'parking',
  RESERVATIONS = 'reservations',
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
