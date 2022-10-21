import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { SignInComponent } from './sign-in/sign-in.component';

import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthPaths } from '../routes';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { ResendAccountActivationComponent } from './resend-account-activation/resend-account-activation.component';

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
        path: AuthPaths.CONFIRM_ACCOUNT,
        component: ConfirmAccountComponent,
      },
      {
        path: AuthPaths.RESEND_ACTIVATION_LINK,
        component: ResendAccountActivationComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
