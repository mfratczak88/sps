import { PolicyCheckContext, PolicyHandler } from './policy.handler';
import { Role } from '../role';
import { UserService } from '../../user/user.service';

export class CanAddVehicle implements PolicyHandler {
  async handle(context: PolicyCheckContext): Promise<boolean> {
    const { userId, moduleRef } = context;
    const userStore = await moduleRef.resolve(UserService);
    const user = await userStore.findById(userId);
    return user.role === Role.DRIVER;
  }
}
export class CanViewDriverDetails implements PolicyHandler {
  async handle(context: PolicyCheckContext): Promise<boolean> {
    const { userId, moduleRef, params } = context;
    const userStore = await moduleRef.resolve(UserService);
    const user = await userStore.findById(userId);
    return (
      (user.role === Role.DRIVER && params['id'] === userId) ||
      user.role === Role.ADMIN
    );
  }
}
export class CanViewDriverReservations implements PolicyHandler {
  async handle(context: PolicyCheckContext): Promise<boolean> {
    const { userId, moduleRef, params } = context;
    const userStore = await moduleRef.resolve(UserService);
    const user = await userStore.findById(userId);
    return (
      user.role === Role.ADMIN ||
      (user.role === Role.DRIVER && params['id'] === userId)
    );
  }
}
