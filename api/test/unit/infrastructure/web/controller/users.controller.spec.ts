import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UserService } from '../../../../../src/infrastructure/security/user/user.service';
import { UsersController } from '../../../../../src/infrastructure/web/controller/users.controller';
import { randomId } from '../../../../misc.util';
import { ChangeRoleCommand } from '../../../../../src/infrastructure/security/user/user.command';
import { Role } from '../../../../../src/infrastructure/security/authorization/role';

describe('Users controller', () => {
  let usersServiceMock: DeepMocked<UserService>;
  let usersController: UsersController;
  beforeEach(() => {
    usersServiceMock = createMock<UserService>();
    usersController = new UsersController(usersServiceMock);
  });
  it('delegates get all call to the service', async () => {
    await usersController.getAll();

    expect(usersServiceMock.getAll).toHaveBeenCalled();
  });
  it('delegates change role call to users service with id from url param', async () => {
    const userId = randomId();
    const command: ChangeRoleCommand = {
      role: Role.ADMIN,
    };
    await usersController.changeRole(userId, command);

    expect(usersServiceMock.changeRole).toHaveBeenCalledWith(
      userId,
      command.role,
    );
  });
});
