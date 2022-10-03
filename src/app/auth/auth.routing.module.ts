import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthPaths } from '../app-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: AuthPaths.SIGN_IN,
        pathMatch: 'full',
      },
      {
        path: AuthPaths.SIGN_IN,
        component: SignInComponent,
      },
      {
        path: AuthPaths.SIGN_UP,
        component: SignUpComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
