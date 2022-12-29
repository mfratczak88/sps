import { Navigate } from '@ngxs/router-plugin';
import { NavigationExtras } from '@angular/router';
import { AuthPaths, ErrorPaths, TopLevelPaths } from '../../../routes';

export namespace AuthActions {
  export class Login {
    static readonly type = '[Auth] Login';

    constructor(readonly email: string, readonly password: string) {}
  }
  export class Register {
    static readonly type = '[Auth] Register';

    constructor(
      readonly name: string,
      readonly email: string,
      readonly password: string,
    ) {}
  }
  export class RefreshToken {
    static readonly type = '[Auth] Refresh Token';
  }
  export class LoginWithGoogle {
    static readonly type = '[Auth] Login With Google';
  }
  export class Logout {
    static readonly type = '[Auth] Logout';
  }
  export class ConfirmRegistration {
    static readonly type = '[Auth] Confirm Registration';

    constructor(readonly id: string) {}
  }
  export class ResendActionLink {
    static readonly type = '[Auth] Resend Activation Link';

    constructor(readonly previousGuid: string) {}
  }
  export class ChangePassword {
    static readonly type = '[Auth] Change Password';

    constructor(readonly oldPassword: string, readonly newPassword: string) {}
  }
  export class RestoreAuth {
    static readonly type = '[Auth] Restore auth';
  }
  export class NavigateToSameRoute extends Navigate {
    constructor(fragment?: string) {
      super([], undefined, {
        fragment,
        queryParamsHandling: fragment && 'preserve',
      });
    }
  }
  export class NavigateToNotFound extends Navigate {
    constructor() {
      super([`/${TopLevelPaths.ERROR}/${ErrorPaths.NOT_FOUND}`]);
    }
  }

  export class NavigateToSignUp extends Navigate {
    constructor() {
      super([`/${TopLevelPaths.AUTH}/${AuthPaths.SIGN_UP}`]);
    }
  }
  export class NavigateToSignIn extends Navigate {
    constructor() {
      super([`/${TopLevelPaths.AUTH}/${AuthPaths.SIGN_IN}`]);
    }
  }
  export class NavigateToPasswordReset extends Navigate {
    constructor() {
      super([`/${TopLevelPaths.AUTH}/${AuthPaths.FORGOT_PASSWORD}`]);
    }
  }
  export class NavigateToResendActivationLink extends Navigate {
    constructor(readonly activationGuid: string) {
      super([`/${TopLevelPaths.AUTH}/${AuthPaths.RESEND_ACTIVATION_LINK}`], {
        previousActivationGuid: activationGuid,
      });
    }
  }
  export class NavigateAfterLogin extends Navigate {
    constructor(url: string) {
      super([url], {}, { replaceUrl: true });
    }
  }
}
