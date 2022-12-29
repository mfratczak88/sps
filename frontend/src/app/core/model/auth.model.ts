export interface CsrfToken {
  csrfToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  validToISO?: string;
  authExpiresIn: string;
  role: Role;
}

export enum Role {
  ADMIN = 'admin',
  DRIVER = 'driver',
  CLERK = 'clerk',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const PASSWORD_MAX_LENGTH = 20;
export const PASSWORD_MIN_LENGTH = 7;

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
}
