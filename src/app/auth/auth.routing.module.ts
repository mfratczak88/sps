import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { SignInComponent } from './sign-in/sign-in.component';

import { SignUpComponent } from './sign-up/sign-up.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ActionCodeComponent } from './action-code/action-code.component';
import { InvalidAuthLinkComponent } from './invalid-auth-link/invalid-auth-link.component';
import { AuthPaths } from '../routes';

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
      {
        path: AuthPaths.FORGOT_PASSWORD,
        component: PasswordResetComponent,
      },
      {
        path: AuthPaths.INVALID_AUTH_LINK,
        component: InvalidAuthLinkComponent,
      },
      {
        path: AuthPaths.ACTION_CODE,
        component: ActionCodeComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
