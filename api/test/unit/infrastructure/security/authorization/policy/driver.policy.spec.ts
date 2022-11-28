import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { User } from '../../../../../../src/infrastructure/security/user/user';
import { ModuleRef } from '@nestjs/core';
import { UserService } from '../../../../../../src/infrastructure/security/user/user.service';
import { Role } from '../../../../../../src/infrastructure/security/authorization/role';
import { randomId } from '../../../../../misc.util';
import { PolicyCheckContext } from '../../../../../../src/infrastructure/security/authorization/policy/policy.handler';
import { CanAddVehicle } from '../../../../../../src/infrastructure/security/authorization/policy/driver.policy';

describe('Driver policy', () => {
  describe('Can add vehicle', () => {
    let userServiceMock: DeepMocked<UserService>;
    let moduleRefMock: DeepMocked<ModuleRef>;
    let canAddVehiclePolicyHandler: CanAddVehicle;
    beforeEach(() => {
      userServiceMock = createMock();
      moduleRefMock = createMock();
      canAddVehiclePolicyHandler = new CanAddVehicle();
    });

    it('Resolves to true if user is driver', async () => {
      const userId = randomId();
      const userFake: Partial<User> = {
        role: Role.DRIVER,
        id: userId,
      };
      moduleRefMock.resolve.mockResolvedValue(userServiceMock);
      userServiceMock.findById.mockImplementation(
        async (id) => id === userId && (userFake as User),
      );
      const policyCheckContext: PolicyCheckContext = {
        userId,
        moduleRef: moduleRefMock,
      };

      const policyCheckPassed = await canAddVehiclePolicyHandler.handle(
        policyCheckContext,
      );
      expect(policyCheckPassed).toEqual(true);
    });
    it('Resolves to false if user is not driver', async () => {
      const userId = randomId();
      const userFake: Partial<User> = {
        role: Role.ADMIN,
        id: userId,
      };
      moduleRefMock.resolve.mockResolvedValue(userServiceMock);
      userServiceMock.findById.mockImplementation(
        async (id) => id === userId && (userFake as User),
      );
      const policyCheckContext: PolicyCheckContext = {
        userId,
        moduleRef: moduleRefMock,
      };

      const policyCheckPassed = await canAddVehiclePolicyHandler.handle(
        policyCheckContext,
      );
      expect(policyCheckPassed).toEqual(false);
    });
  });
});
