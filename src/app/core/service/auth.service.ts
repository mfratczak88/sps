import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AuthCredentials, User } from '../model/auth.model';
import { concatMap, from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.user.pipe(
      map(
        user =>
          user && {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          },
      ),
    );
    this.authenticated$ = this.afAuth.user.pipe(
      map(user => !!user && user.emailVerified),
    );
  }

  readonly authenticated$: Observable<boolean>;

  readonly user$: Observable<User | null>;

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
}
