import { RegistrationMethod } from './user';
import { Role } from '../authorization/role';
import { IsEnum, IsNotEmpty } from 'class-validator';

export interface CreateUserCommand {
  email: string;
  password?: string;
  name: string;
  registrationMethod: RegistrationMethod;
}

export class ChangeRoleCommand {
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
