import { BaseException, ExceptionCode } from '../../error';
import { MessageCode, MessageSourceArea } from '../../message';

export class SecurityException extends BaseException {
  constructor(
    message: MessageCode,
    status: ExceptionCode,
    args?: { [key: string]: unknown },
  ) {
    super(
      {
        messageKey: message,
        sourceArea: MessageSourceArea.SECURITY,
        args,
      },
      status,
    );
  }
}
