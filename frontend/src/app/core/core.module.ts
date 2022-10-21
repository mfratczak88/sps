import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AuthInterceptor } from './interceptor/auth-token.interceptor';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { GoogleAuthService } from './service/google.auth.service';
import { environment } from '../../environments/environment';

const socialLoginProviderConfig = {
  provide: 'SocialAuthServiceConfig',
  useValue: {
    autoLogin: false,
    providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleAuthService(environment.googleClientId),
      },
    ],
  } as SocialAuthServiceConfig,
};
const providers = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  socialLoginProviderConfig,
];
@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, AkitaNgRouterStoreModule],
  providers: [...providers],
})
export class CoreModule {}
