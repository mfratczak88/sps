import { ModuleRef } from '@nestjs/core';
import { Id } from '../../../../domain/id';

export interface PolicyCheckContext {
  moduleRef: ModuleRef;
  userId: Id;
  command?: unknown;
  params?: unknown;
}

export abstract class PolicyHandler {
  abstract handle(context: PolicyCheckContext): Promise<boolean>;
}
