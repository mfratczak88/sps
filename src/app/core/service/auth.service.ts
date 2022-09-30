import { Injectable } from '@angular/core';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Router } from '@angular/router';
import firebase from '@firebase/app-compat';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly angularFireAuth: AngularFireAuth,
    private readonly router: Router,
  ) {}

  private authUI: firebaseui.auth.AuthUI;

  renderAuthUi(containerId: string) {
    this.angularFireAuth.app.then(app => {
      const uiConfig = {
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccessWithAuthResult: this.onLoginSuccess.bind(this),
        },
      };
      this.authUI = new firebaseui.auth.AuthUI(app.auth());
      this.authUI.start(`#${containerId}`, uiConfig);
      this.authUI.disableAutoSignIn();
    });
  }

  private onLoginSuccess(result: any) {
    console.log(result);
    this.router.navigate(['/']);
    return true;
  }
}
