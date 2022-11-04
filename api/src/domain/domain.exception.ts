import { BaseException } from '../error';
import { MessageCode, MessageSourceArea } from '../message';

export class DomainException extends BaseException {
  constructor({
    message,
    args,
  }: {
    message: MessageCode;
    args?: { [key: string]: any };
  }) {
    super({
      args,
      messageKey: message,
      sourceArea: MessageSourceArea.DOMAIN,
    });
  }
}
