import { Id } from '../../application/id';

export interface User {
  readonly id: Id;

  readonly email: string;

  password?: string;

  readonly name: string;

  active: boolean;

  deleted?: boolean;

  registrationMethod: RegistrationMethod;

  refreshToken?: string;
}
export interface RegistrationToken {
  readonly id: Id;

  readonly userId: Id;

  readonly activationGuid: Id;

  readonly guidValidTo: string;
}
export enum RegistrationMethod {
  manual = 'manual',
  google = 'google',
}
