import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth-token.interceptor';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { GoogleAuthService } from './service/google.auth.service';
import { environment } from '../../environments/environment';
import { NGXS_PLUGINS, NgxsModule } from '@ngxs/store';
import { ParkingLotsState } from './store/parking-lot/parking-lot.state';
import { DriversState } from './store/drivers/drivers.state';
import { ReservationsState } from './store/reservations/reservations.state';
import {
  NgxsRouterPluginModule,
  RouterStateSerializer,
} from '@ngxs/router-plugin';
import { AuthState } from './store/auth/auth.state';
import { UiState } from './store/ui/ui.state';
import { RouteStateSerializer } from './service/route-state-serializer';
import { LangInterceptor } from './interceptor/lang.interceptor';
import { logoutPlugin } from './store/logout.plugin';

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
  { provide: HTTP_INTERCEPTORS, useClass: LangInterceptor, multi: true },
  socialLoginProviderConfig,
  { provide: RouterStateSerializer, useClass: RouteStateSerializer },
  { provide: NGXS_PLUGINS, useValue: logoutPlugin, multi: true },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxsModule.forFeature([
      AuthState,
      UiState,
      ParkingLotsState,
      DriversState,
      ReservationsState,
    ]),
    NgxsRouterPluginModule.forRoot(), // core module is the actual root for router
  ],
  providers: [...providers],
})
export class CoreModule {}
