import { RegistrationMethod } from './user';

export interface CreateUserCommand {
  email: string;

  password?: string;

  name: string;

  registrationMethod: RegistrationMethod;
}
