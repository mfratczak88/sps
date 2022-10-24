import { RoleKeys } from '../../../core/translation-keys';

export type User = UserResponse & {
  roleTranslation: string;
};

export enum Role {
  ADMIN = 'admin',
  DRIVER = 'driver',
  CLERK = 'clerk',
}
export interface RoleWithTranslation {
  role: Role;
  translation: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: Role;
}
export const RoleToTranslationKey = {
  [Role.ADMIN]: RoleKeys.ADMIN,
  [Role.DRIVER]: RoleKeys.DRIVER,
  [Role.CLERK]: RoleKeys.CLERK,
};
