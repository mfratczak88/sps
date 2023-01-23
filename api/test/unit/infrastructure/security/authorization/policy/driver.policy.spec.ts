import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { User } from '../../../../../../src/infrastructure/security/user/user';
import { ModuleRef } from '@nestjs/core';
import { UserService } from '../../../../../../src/infrastructure/security/user/user.service';
import { Role } from '../../../../../../src/infrastructure/security/authorization/role';
import { randomId } from '../../../../../misc.util';
import {
  CanAddVehicle,
  CanViewDriverDetails,
} from '../../../../../../src/infrastructure/security/authorization/policy/driver.policy';

describe('Driver policy', () => {
  let userServiceMock: DeepMocked<UserService>;
  let moduleRefMock: DeepMocked<ModuleRef>;
  const returnUserFromServiceIfIdMatches = (
    userId: string,
    user: Partial<User>,
  ) =>
    userServiceMock.findById.mockImplementation(
      async (id) => id === userId && (user as User),
    );
  beforeEach(() => {
    userServiceMock = createMock();
    moduleRefMock = createMock();
    moduleRefMock.resolve.mockResolvedValue(userServiceMock);
  });
  describe('Can add vehicle', () => {
    let canAddVehiclePolicyHandler: CanAddVehicle;
    beforeEach(() => {
      canAddVehiclePolicyHandler = new CanAddVehicle();
    });

    it('Resolves to true if user is driver', async () => {
      const userId = randomId();
      const userFake: Partial<User> = {
        role: Role.DRIVER,
        id: userId,
      };
      returnUserFromServiceIfIdMatches(userId, userFake);
      const can = await canAddVehiclePolicyHandler.handle({
        userId,
        moduleRef: moduleRefMock,
        params: { driverId: userId },
      });
      expect(can).toEqual(true);
    });
    it('Resolves to false if user is not driver', async () => {
      const userId = randomId();
      const userFake: Partial<User> = {
        role: Role.ADMIN,
        id: userId,
      };
      returnUserFromServiceIfIdMatches(userId, userFake);

      const can = await canAddVehiclePolicyHandler.handle({
        userId,
        moduleRef: moduleRefMock,
      });

      expect(can).toEqual(false);
    });
  });
  describe('Can view driver details', () => {
    let canViewDriverDetails: CanViewDriverDetails;
    beforeEach(() => {
      canViewDriverDetails = new CanViewDriverDetails();
    });
    it('Returns true if user is driver & id from url matches user id', async () => {
      const userId = randomId();
      const mockUser: Partial<User> = {
        id: userId,
        role: Role.DRIVER,
      };
      returnUserFromServiceIfIdMatches(userId, mockUser);
      const can = await canViewDriverDetails.handle({
        userId,
        moduleRef: moduleRefMock,
        params: { id: userId },
      });
      expect(can).toEqual(true);
    });
    it('Returns true if user is admin', async () => {
      const userId = randomId();
      const mockUser: Partial<User> = {
        id: userId,
        role: Role.ADMIN,
      };
      returnUserFromServiceIfIdMatches(userId, mockUser);
      const can = await canViewDriverDetails.handle({
        userId,
        moduleRef: moduleRefMock,
      });
      expect(can).toEqual(true);
    });
  });
});
