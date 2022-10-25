import { Injectable } from '@nestjs/common';
import { IdGenerator, Id } from '../../domain/id';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PrismaIdGenerator extends IdGenerator {
  generate(): Id {
    return uuidv4();
  }
}
