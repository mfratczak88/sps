import { User } from '../src/app/core/model/user.model';
import { Role } from '../src/app/core/model/auth.model';

export const mockUsers: User[] = [
  {
    id: '4',
    email: 'alex@gmail.com',
    role: Role.DRIVER,
    name: 'Alex',
    roleTranslation: 'Driver',
  },
  {
    id: '433',
    email: 'mike@gmail.com',
    role: Role.ADMIN,
    name: 'Mike',
    roleTranslation: 'Administrator',
  },
];
