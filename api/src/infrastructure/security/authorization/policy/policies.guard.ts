import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { PolicyHandler } from './policy.handler';
import { CHECK_POLICIES_KEY } from './check-policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];
    const request = context.switchToHttp().getRequest();
    const { user, body, params } = request;
    return (
      await Promise.all(
        policyHandlers.map((policyHandler) =>
          policyHandler.handle({
            moduleRef: this.moduleRef,
            userId: user.id,
            command: body,
            params,
          }),
        ),
      )
    ).every((policyFulfilled) => !!policyFulfilled);
  }
}
