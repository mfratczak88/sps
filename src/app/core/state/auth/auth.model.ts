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
export type AuthActionMode = 'verifyEmail' | 'resetPassword';

export interface AuthActionCodeQueryParams {
  mode: AuthActionMode | null;
  oobCode: string | null;
}
