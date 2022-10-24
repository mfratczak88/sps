import { Injectable } from '@nestjs/common';
import { IdGenerator } from '../../application/id.generator';
import { v4 as uuidv4 } from 'uuid';
import { Id } from '../../application/id';

@Injectable()
export class PrismaIdGenerator extends IdGenerator {
  generate(): Promise<Id> {
    return uuidv4();
  }
}
