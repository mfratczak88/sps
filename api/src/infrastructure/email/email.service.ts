import { Injectable } from '@nestjs/common';

import Mailgun from 'mailgun.js';
import Client from 'mailgun.js/client';
import { BaseException, ExceptionCode } from '../../error';
import { MessageCode, MessageSourceArea } from '../../message';
import { Environment } from '../../configuration.module';
import { User } from '../security/user/user';
import { AccountRegistrationConfirmationForm } from './templates/account-registration-confirmation.form';
import { MessagesSendResult } from 'mailgun.js/interfaces/Messages';

@Injectable()
export class EmailService {
  private mgClient: Client;
  constructor(
    private readonly mg: Mailgun,
    private readonly environment: Environment,
  ) {
    this.mgClient = mg.client({
      username: this.environment.MAILGUN_USER,
      key: this.environment.MAILGUN_API_KEY,
    });
  }

  async sendAccountConfirmation(
    user: User,
    confirmationUrl: string,
    lang: string,
  ) {
    const emailForm = new AccountRegistrationConfirmationForm(
      confirmationUrl,
      user.name,
      lang,
    );
    const result = await this.mgClient.messages.create(
      this.environment.MAILGUN_EMAIL_DOMAIN,
      {
        to: user.email,
        from: this.environment.ACCOUNT_EMAIL,
        subject: emailForm.subject,
        html: emailForm.renderHtml(),
      },
    );
    EmailService.handleMessageSendResult(result);
  }

  private static handleMessageSendResult(result: MessagesSendResult) {
    if (!result.status.toString().startsWith('2')) {
      console.error(result.details);
      throw new EmailException(result.details);
    }
    console.log('Email sent');
    console.log(result);
  }
}
export class EmailException extends BaseException {
  constructor(details: string) {
    super(
      {
        messageKey: MessageCode.EMAIL_SENDING_FAILED,
        sourceArea: MessageSourceArea.EMAIL,
        args: { details },
      },
      ExceptionCode.BAD_REQUEST,
    );
  }
}
