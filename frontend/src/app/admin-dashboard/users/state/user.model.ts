import { RoleKeys } from '../../../core/translation-keys';
import { environment } from '../../../../environments/environment';

export const API_URL = environment.functionsUrl + '/users';
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  roleTranslation: string;
  lastSignInTime: string;
  creationTime: string;
}

export enum Role {
  ADMIN = 'admin',
  DRIVER = 'driver',
  CLERK = 'clerk',
}
export interface RoleWithTranslation {
  role: Role;
  translation: string;
}

export const RoleToTranslationKey = {
  [Role.ADMIN]: RoleKeys.ADMIN,
  [Role.DRIVER]: RoleKeys.DRIVER,
  [Role.CLERK]: RoleKeys.CLERK,
};
