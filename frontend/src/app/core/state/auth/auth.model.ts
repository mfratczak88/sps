export interface User {
  id: string;
  email: string;
  name: string;
  validToISO?: string;
  authExpiresIn: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const PASSWORD_MAX_LENGTH = 20;
export const PASSWORD_MIN_LENGTH = 7;
export const initialStoreState: User = {
  email: '',
  id: '',
  validToISO: '',
  name: '',
  authExpiresIn: '',
};

export interface RegisterUserPayload {
  email: string;
  password: string;
}
