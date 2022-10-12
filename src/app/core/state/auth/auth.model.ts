export interface AuthCredentials {
  email: string;
  password: string;
}
export interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 25;
export enum AuthActionMode {
  VERIFY_EMAIL = 'verifyEmail',
  RESET_PASSWORD = 'resetPassword',
}
export interface AuthActionCodeQueryParams {
  mode: AuthActionMode | null;
  oobCode: string | null;
}
