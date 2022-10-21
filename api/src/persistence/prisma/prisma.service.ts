import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ExceptionCode, PersistenceException } from '../../error';
import { MessageCode } from '../../message';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['warn', 'info', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  handlePrismaError(err: Error) {
    console.error(err);
    let messageCode: MessageCode;
    let args;
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2000':
          messageCode = MessageCode.VALUE_TOO_LONG;
          args = { field: err.meta['column_name'] };
          break;
        case 'P2002':
          messageCode = MessageCode.UNIQUE_CONSTRAINT_FAILED;
          args = { constraint: err.meta['constraint'] };
          break;
        case 'P2003':
          messageCode = MessageCode.FOREIGN_CONSTRAINT_FAILED;
          args = { field: err.meta['field_name'] };
          break;
        case 'P2006':
          messageCode = MessageCode.INVALID_FIELD_VALUE;
          args = { field: err.meta['field_name'] };
          break;
        case 'P2011':
          messageCode = MessageCode.NULL_CONSTRAINT_VIOLATION;
          args = { constraint: err.meta['constraint'] };
          break;
        case 'P2014':
          messageCode = MessageCode.RELATION_VIOLATION;
          args = { relation: err.meta['relation_name'] };
          break;
        case 'P2020':
          messageCode = MessageCode.OUT_OF_RANGE;
          args = { details: err.meta['details'] };
      }

      throw new PersistenceException(
        messageCode || MessageCode.UNKNOWN_PERSISTENCE_ERROR,
        ExceptionCode.BAD_REQUEST,
        args,
      );
    } else {
      throw new PersistenceException(
        MessageCode.UNKNOWN_PERSISTENCE_ERROR,
        ExceptionCode.UNKNOWN_ERROR,
        { message: err.message },
      );
    }
  }
}

export type StringFilter = Prisma.StringFilter;
export { Prisma };
