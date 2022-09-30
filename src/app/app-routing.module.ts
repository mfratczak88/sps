import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum TopLevelPaths {
  AUTH = 'auth',
  ADMIN_DASHBOARD = 'admin-dashboard',
}
const routes: Routes = [
  {
    path: '',
    redirectTo: TopLevelPaths.AUTH,
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
