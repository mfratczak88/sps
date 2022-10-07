import { Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { concatMap, from } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AuthCredentials } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly authStore: AuthStore,
    private readonly afAuth: AngularFireAuth,
  ) {
    this.afAuth.user.subscribe(user => {
      if (user) {
        const { email, emailVerified, displayName, photoURL } = user;
        this.authStore.update(() => ({
          email,
          emailVerified,
          displayName,
          photoURL,
        }));
      }
    });
  }

  signIn(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  signInWithGoogle() {
    return from(
      this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()),
    );
  }

  signUp({ email, password }: AuthCredentials) {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password),
    ).pipe(
      concatMap(result => {
        return from(result.user!.sendEmailVerification());
      }),
      concatMap(() => this.afAuth.signOut()),
    );
  }

  signOut() {
    return this.afAuth.signOut();
  }

  sendResetPasswordEmail(email: string) {
    return from(this.afAuth.sendPasswordResetEmail(email));
  }

  verifyEmail(oobCode: string) {
    return from(this.afAuth.applyActionCode(oobCode));
  }

  currentUser$() {
    return this.afAuth.user;
  }
}
