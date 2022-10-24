import { Injectable } from '@nestjs/common';
import { RegistrationTokenStore, UserStore } from './user.store';
import { IdGenerator } from '../../../application/id.generator';
import { Id } from '../../../application/id';
import { RegistrationMethod, RegistrationToken, User, UserDto } from './user';
import { CreateUserCommand } from './user.command';
import { UnitOfWork } from '../../../application/unit-of-work';
import { MessageCode } from '../../../message';
import { SecurityException } from '../security.exception';
import { ExceptionCode } from '../../../error';
import { Environment } from '../../../configuration.module';
import { Role } from '../authorization/role';

@Injectable()
export class UserService {
  constructor(
    private readonly userStore: UserStore,
    private readonly registrationTokenStore: RegistrationTokenStore,
    private readonly idGenerator: IdGenerator,
    private readonly unitOfWork: UnitOfWork,
    private readonly env: Environment,
  ) {}
  async findById(id: Id): Promise<User> {
    return this.userStore.findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userStore.findByEmail(email);
  }

  async findRegistrationTokenByActivationGuid(
    activationGuid: Id,
  ): Promise<RegistrationToken> {
    return this.registrationTokenStore.findByActivationGuid(activationGuid);
  }

  async createNew(
    command: CreateUserCommand,
  ): Promise<{ user: User; registrationToken?: RegistrationToken }> {
    await this.unitOfWork.beginTransaction();
    try {
      const { email, password, name, registrationMethod } = command;
      const active = registrationMethod !== RegistrationMethod.manual;
      const id = await this.idGenerator.generate();
      const user: User = {
        id,
        name,
        email,
        active,
        password,
        registrationMethod,
        role: Role.DRIVER,
      };
      await this.userStore.save(user);
      if (registrationMethod !== RegistrationMethod.manual) {
        return { user };
      }
      const registrationToken = await this.generateRegistrationTokenFor(user);
      return {
        user,
        registrationToken,
      };
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }

  async generateRegistrationTokenFor(user: User) {
    const datetime = new Date();
    datetime.setHours(
      datetime.getHours() + this.env.ACTIVATE_ACCOUNT_LINK_EXPIRATION_IN_HOURS,
    );
    const registrationToken: RegistrationToken = {
      id: await this.idGenerator.generate(),
      userId: user.id,
      activationGuid: await this.idGenerator.generate(),
      guidValidTo: datetime.toISOString(),
    };
    await this.registrationTokenStore.save(registrationToken);
    return registrationToken;
  }

  async isActive(email: string): Promise<boolean> {
    const user = await this.userStore.findByEmail(email);
    return user && user.active;
  }

  async changePassword(userId: string, password: string): Promise<User> {
    const user = await this.userStore.findById(userId);
    if (!user) {
      throw new SecurityException(
        MessageCode.USER_DOES_NOT_EXIST,
        ExceptionCode.UNAUTHORIZED,
      );
    }
    user.password = password;
    await this.userStore.save(user);
    return user;
  }

  async markUserAsActive(activationGuid: Id): Promise<void> {
    const registrationToken =
      await this.registrationTokenStore.findByActivationGuid(activationGuid);
    if (!registrationToken) {
      throw new SecurityException(
        MessageCode.INVALID_ACTIVATION_GUID,
        ExceptionCode.BAD_REQUEST,
      );
    }
    const validToDate = new Date(registrationToken.guidValidTo);
    if (new Date() > validToDate) {
      throw new SecurityException(
        MessageCode.URL_NO_LONGER_VALID,
        ExceptionCode.BAD_REQUEST,
      );
    }
    const user = await this.userStore.findById(registrationToken.userId);
    user.active = true;
    await this.userStore.save(user);
  }

  async updateRefreshTokenFor(userId: Id, refreshToken: string) {
    const user = await this.userStore.findById(userId);
    if (!user) {
      throw new SecurityException(
        MessageCode.REFRESH_TOKEN_USER_NOT_FOUND,
        ExceptionCode.UNAUTHORIZED,
      );
    }
    user.refreshToken = refreshToken;
    await this.userStore.save(user);
  }

  async getAll(): Promise<UserDto[]> {
    const users = await this.userStore.findAll();
    return users.map((user) => {
      const { id, name, email, role } = user;
      return {
        id,
        name,
        email,
        role,
      };
    });
  }

  async changeRole(userId: Id, newRole: Role) {
    const user = await this.userStore.findById(userId);
    if (!user) {
      throw new SecurityException(
        MessageCode.USER_DOES_NOT_EXIST,
        ExceptionCode.BAD_REQUEST,
      );
    }
    user.role = newRole;
    await this.userStore.save(user);
  }
}
