import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth.routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { EmailSignInFormComponent } from './sign-in/email-sign-in-form/email-sign-in-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { ResendAccountActivationComponent } from './resend-account-activation/resend-account-activation.component';

@NgModule({
  declarations: [
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    EmailSignInFormComponent,
    ConfirmAccountComponent,
    ResendAccountActivationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}
