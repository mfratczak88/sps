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
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { InvalidEmailVerifyLinkComponent } from './invalid-email-verify-link/invalid-email-verify-link.component';
import { ActionCodeComponent } from './action-code/action-code.component';

@NgModule({
  declarations: [
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    EmailSignInFormComponent,
    PasswordResetComponent,
    InvalidEmailVerifyLinkComponent,
    ActionCodeComponent,
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
