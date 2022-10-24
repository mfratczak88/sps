import { SetMetadata } from '@nestjs/common';
import { Role } from './role';

export const ROLES_KEY = 'roles';
export const EnforceRole = (...role: Role[]) => SetMetadata(ROLES_KEY, role);
