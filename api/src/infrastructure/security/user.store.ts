import { RegistrationToken, User } from './user';
import { Id } from '../../application/id';

export abstract class UserStore {
  abstract findById(id: Id): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
  abstract save(user: User): Promise<void>;
}
export abstract class RegistrationTokenStore {
  abstract findById(id: Id): Promise<RegistrationToken>;
  abstract findByActivationGuid(id: Id): Promise<RegistrationToken>;
  abstract save(registrationToken: RegistrationToken): Promise<void>;
}
