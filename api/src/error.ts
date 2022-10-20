import { MessageCode, MessageSourceArea, TranslatableMessage } from './message';
import { HttpStatus } from '@nestjs/common';
export enum ExceptionCode {
  BAD_REQUEST = HttpStatus.BAD_REQUEST,
  UNAUTHORIZED = HttpStatus.UNAUTHORIZED,
  FORBIDDEN = HttpStatus.FORBIDDEN,
  UNKNOWN_ERROR = HttpStatus.INTERNAL_SERVER_ERROR,
  NOT_FOUND = HttpStatus.NOT_FOUND,
}
export class BaseException extends Error {
  constructor(
    readonly messageProps: TranslatableMessage,
    readonly exceptionCode: ExceptionCode = ExceptionCode.UNKNOWN_ERROR,
  ) {
    super(messageProps.sourceArea + '.' + messageProps.messageKey);
  }
}
export class PersistenceException extends BaseException {
  constructor(
    message: MessageCode,
    status: ExceptionCode,
    args?: { [key: string]: unknown },
  ) {
    super(
      {
        messageKey: message,
        sourceArea: MessageSourceArea.PERSISTENCE,
        args,
      },
      status,
    );
  }
}
