import { BaseException, ExceptionCode } from '../error';
import { MessageCode, MessageSourceArea } from '../message';

export class ApplicationException extends BaseException {
  constructor(message: MessageCode, status: ExceptionCode) {
    super(
      { messageKey: message, sourceArea: MessageSourceArea.APPLICATION },
      status,
    );
  }
}
