import { Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { concatMap, from, tap } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AuthCredentials } from './auth.model';
import { ToastService } from '../../service/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly authStore: AuthStore,
    private readonly afAuth: AngularFireAuth,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
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
      tap(() =>
        this.toastService.show(
          this.translateService.instant(ToastMessageKeys.CHECK_EMAIL),
        ),
      ),
    );
  }

  signOut() {
    return this.afAuth.signOut();
  }

  sendResetPasswordEmail(email: string) {
    return from(this.afAuth.sendPasswordResetEmail(email)).pipe(
      tap(() =>
        this.toastService.show(
          this.translateService.instant(ToastMessageKeys.PASS_RESET_MAIL_SENT),
        ),
      ),
    );
  }

  verifyEmail(oobCode: string) {
    return from(this.afAuth.applyActionCode(oobCode)).pipe(
      tap(() =>
        this.toastService.show(
          this.translateService.instant(ToastMessageKeys.EMAIL_VERIFIED),
        ),
      ),
    );
  }

  currentUser$() {
    return this.afAuth.user;
  }
}
enum ToastMessageKeys {
  CHECK_EMAIL = 'CHECK_EMAIL',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  PASS_RESET_MAIL_SENT = 'PASS_RESET_MAIL_SENT',
}
