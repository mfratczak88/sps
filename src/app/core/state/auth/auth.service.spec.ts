import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastService } from '../../service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase/compat';
import { first, lastValueFrom, Subject } from 'rxjs';
import { AuthStore } from './auth.store';
import SpyObj = jasmine.SpyObj;
import User = firebase.User;
import UserCredential = firebase.auth.UserCredential;

describe('Auth service spec', () => {
  let authService: AuthService;
  let afAuthSpy: SpyObj<AngularFireAuth>;
  let toastServiceSpy: SpyObj<ToastService>;
  let translateServiceSpy: SpyObj<TranslateService>;
  let authStore: SpyObj<AuthStore>;
  let userSpy: SpyObj<User>;
  let user$: Subject<User>;
  beforeEach(() => {
    user$ = new Subject();
    userSpy = jasmine.createSpyObj('User', ['sendEmailVerification']);
    afAuthSpy = jasmine.createSpyObj('AngularFireAuth', [
      'signInWithEmailAndPassword',
      'signInWithPopup',
      'createUserWithEmailAndPassword',
      'signOut',
      'sendPasswordResetEmail',
      'applyActionCode',
    ]);

    (afAuthSpy as any).user = user$;
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    authStore = jasmine.createSpyObj('AuthStore', ['update']);
    authService = new AuthService(
      authStore,
      afAuthSpy,
      toastServiceSpy,
      translateServiceSpy,
    );
  });

  it('updates store values emitted from afAuth if user is not falsy', () => {
    const user: Partial<User> = {
      email: 'maciek@gmail.com',
      emailVerified: true,
      displayName: 'Maciek',
      photoURL: 'https://some-url.com/433.jpg',
    };
    expect(authStore.update).not.toHaveBeenCalled();
    user$.next(user as User);
    expect(authStore.update).toHaveBeenCalled();
  });
  it('signIn - calls afAuth signInWithEmailAndPassword', () => {
    const email = 'maciek@gmail.com';
    const password = '4re3dwed32c';
    afAuthSpy.signInWithEmailAndPassword.and.resolveTo();
    authService.signIn(email, password);
    expect(afAuthSpy.signInWithEmailAndPassword).toHaveBeenCalledWith(
      email,
      password,
    );
  });

  it('signUp - creates user, send verification email and signs out from af', async () => {
    // given
    const checkEmailText = 'Check your email';
    translateServiceSpy.instant.and.returnValue(checkEmailText);
    afAuthSpy.signOut.and.resolveTo();
    userSpy.sendEmailVerification.and.resolveTo();
    afAuthSpy.createUserWithEmailAndPassword.and.resolveTo(({
      user: userSpy,
    } as unknown) as UserCredential);
    const email = 'maciek@gmail.com';
    const password = 'somePassword1234!';

    // when
    await lastValueFrom(authService.signUp({ email, password }).pipe(first()));

    // then
    expect(afAuthSpy.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      email,
      password,
    );
    expect(userSpy.sendEmailVerification).toHaveBeenCalled();
    expect(afAuthSpy.signOut).toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalledWith(checkEmailText);
  });
  it('signOut - calls afAuth', () => {
    authService.signOut();
    expect(afAuthSpy.signOut).toHaveBeenCalled();
  });
  it('sendResetPassword - calls afAuth and shows toast', async () => {
    const passResetToastText = 'Email sent';
    translateServiceSpy.instant.and.returnValue(passResetToastText);
    const email = 'mike@gmail.com';
    afAuthSpy.sendPasswordResetEmail.and.resolveTo();

    await lastValueFrom(authService.sendResetPasswordEmail(email));

    expect(afAuthSpy.sendPasswordResetEmail).toHaveBeenCalledWith(email);
    expect(toastServiceSpy.show).toHaveBeenCalledWith(passResetToastText);
  });
  it('verifyEmail - calls afAuth and shows toast', async () => {
    const oobCode = '423eds1!';
    const emailVerifiedToastText = 'Email has been verified';
    translateServiceSpy.instant.and.returnValue(emailVerifiedToastText);
    afAuthSpy.applyActionCode.and.resolveTo();
    await lastValueFrom(authService.verifyEmail(oobCode));

    expect(afAuthSpy.applyActionCode).toHaveBeenCalledWith(oobCode);
    expect(toastServiceSpy.show).toHaveBeenCalledWith(emailVerifiedToastText);
  });
});
