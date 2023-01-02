import { RoleKeys } from '../translation-keys';
import { Role } from './auth.model';

export type User = UserResponse & {
  roleTranslation: string;
};

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
