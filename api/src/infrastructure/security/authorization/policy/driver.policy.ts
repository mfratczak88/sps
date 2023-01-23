import { PolicyCheckContext, PolicyHandler } from './policy.handler';
import { Role } from '../role';
import { UserService } from '../../user/user.service';

export class CanAddVehicle implements PolicyHandler {
  async handle({
    userId,
    moduleRef,
    params,
  }: PolicyCheckContext): Promise<boolean> {
    const userStore = await moduleRef.resolve(UserService);
    const { role } = await userStore.findById(userId);
    return role === Role.DRIVER && params['driverId'] === userId;
  }
}
export class CanViewDriverDetails implements PolicyHandler {
  async handle({
    userId,
    moduleRef,
    params,
  }: PolicyCheckContext): Promise<boolean> {
    const userStore = await moduleRef.resolve(UserService);
    const { role } = await userStore.findById(userId);
    return (
      (role === Role.DRIVER && params['id'] === userId) || role === Role.ADMIN
    );
  }
}
