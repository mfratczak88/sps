import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import {
  AngularFirestoreModule,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
} from '@angular/fire/compat/firestore';
import {
  AngularFireAuthModule,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/compat/auth';
const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      scopes: ['public_profile', 'email', 'user_likes', 'user_friends'],
      customParameters: {
        auth_type: 'reauthenticate',
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
  ],
  providers: [
    {
      provide: USE_AUTH_EMULATOR,
      useValue: environment.useEmulators
        ? ['http://localhost:9099']
        : undefined,
    },
    {
      provide: USE_FIRESTORE_EMULATOR,
      useValue: environment.useEmulators ? ['localhost', '8080'] : undefined,
    },
  ],
})
export class CoreModule {}
