import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgModule } from '@angular/core';

import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';
import { ErrorPaths } from '../routes';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorComponent,
    children: [
      {
        path: ErrorPaths.INTERNAL_SERVER_ERROR,
        component: InternalServerErrorComponent,
      },
      {
        path: ErrorPaths.UNAUTHORIZED,
        component: UnauthorizedComponent,
      },
      {
        path: '',
        redirectTo: ErrorPaths.NOT_FOUND,
        pathMatch: 'full',
      },
      {
        path: ErrorPaths.NOT_FOUND,
        component: NotFoundComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}
