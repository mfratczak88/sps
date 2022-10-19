import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';
import {
  AngularFirestoreModule,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
} from '@angular/fire/compat/firestore';
import {
  AngularFireAuthModule,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/compat/auth';
import { HttpClientModule } from '@angular/common/http';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AuthTokenHttpInterceptorProvider } from './interceptor/auth-token.interceptor';

const providers = [
  {
    provide: USE_AUTH_EMULATOR,
    useValue: environment.useEmulators ? ['http://localhost:9099'] : undefined,
  },
  {
    provide: USE_FIRESTORE_EMULATOR,
    useValue: environment.useEmulators ? ['localhost', '8080'] : undefined,
  },
  AuthTokenHttpInterceptorProvider,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAuthModule,
    AkitaNgRouterStoreModule,
  ],
  providers: [...providers],
})
export class CoreModule {}
