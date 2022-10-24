import { EmailService } from '../../../../src/infrastructure/email/email.service';
import { createMock } from '@golevelup/ts-jest';
import Mailgun from 'mailgun.js';
import Client from 'mailgun.js/client';

import { Environment } from '../../../../src/configuration.module';
import {
  RegistrationMethod,
  User,
} from '../../../../src/infrastructure/security/user/user';
import { AccountRegistrationConfirmationForm } from '../../../../src/infrastructure/email/templates/account-registration-confirmation.form';
import MessagesClient from 'mailgun.js/messages';
import { Role } from '../../../../src/infrastructure/security/authorization/role';
import clearAllMocks = jest.clearAllMocks;

describe('Email service', () => {
  let emailService: EmailService;
  const mailGunMock = createMock<Mailgun>();
  const mgClientMock = createMock<Client>();
  const messagesClient = createMock<MessagesClient>();
  const envMock: Partial<Environment> = {
    MAILGUN_USER: 'foo@gmail.com',
    MAILGUN_API_KEY: 'some-key',
    MAILGUN_RELAY_URL: '',
    MAILGUN_EMAIL_DOMAIN: 'some-domain.org',
    ACCOUNT_EMAIL: 'account@some-domain.com',
  };
  beforeEach(() => {
    jest.resetModules();
    clearAllMocks();
    mailGunMock.client.mockReturnValue(mgClientMock);
    mgClientMock.messages = messagesClient;
    emailService = new EmailService(mailGunMock, envMock as Environment);
  });

  it('Sends account confirmation with confirmation email in polish', async () => {
    const confirmationEmail = 'sps.io/confirmation/3e3easdas';
    const user: User = {
      id: '3',
      name: 'Alex',
      password: 'Some pass',
      active: true,
      email: 'alex@gmail.com',
      registrationMethod: RegistrationMethod.manual,
      role: Role.ADMIN,
    };
    messagesClient.create.mockResolvedValue({
      status: 200,
    });
    await emailService.sendAccountConfirmation(user, confirmationEmail, 'PL');
    const emailFormInPolish = new AccountRegistrationConfirmationForm(
      confirmationEmail,
      user.name,
      'PL',
    );
    expect(messagesClient.create.mock.lastCall).toEqual([
      envMock.MAILGUN_EMAIL_DOMAIN,
      {
        to: user.email,
        from: envMock.ACCOUNT_EMAIL,
        subject: emailFormInPolish.subject,
        html: emailFormInPolish.renderHtml(),
      },
    ]);
  });
  it('Sends account confirmation email in english', async () => {
    const confirmationEmail = 'sps.io/confirmation/3e3easdas';
    const user: User = {
      id: '3',
      name: 'Alex',
      password: 'Some pass',
      active: true,
      email: 'alex@gmail.com',
      registrationMethod: RegistrationMethod.manual,
      role: Role.DRIVER,
    };
    messagesClient.create.mockResolvedValue({
      status: 200,
    });
    await emailService.sendAccountConfirmation(user, confirmationEmail, 'EN');
    const emailFormInEnglish = new AccountRegistrationConfirmationForm(
      confirmationEmail,
      user.name,
      'EN',
    );
    expect(messagesClient.create.mock.lastCall).toEqual([
      envMock.MAILGUN_EMAIL_DOMAIN,
      {
        to: user.email,
        from: envMock.ACCOUNT_EMAIL,
        subject: emailFormInEnglish.subject,
        html: emailFormInEnglish.renderHtml(),
      },
    ]);
  });
});
