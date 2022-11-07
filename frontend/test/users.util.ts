import { Role, User } from '../src/app/admin-dashboard/users/state/user.model';

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
