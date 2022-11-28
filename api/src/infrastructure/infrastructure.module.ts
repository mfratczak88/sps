import { Global, Module, Provider, Scope } from '@nestjs/common';
import { EmailService } from './email/email.service';

import Mailgun from 'mailgun.js';
import * as FormData from 'form-data';
import { LangService } from './web/lang.service';
import { LanguageService } from '../application/language.service';
import { ConfigurationModule, Environment } from '../configuration.module';
import { WebModule } from './web/web.module';

const providers: Provider[] = [
  {
    provide: EmailService,
    useFactory: async (env: Environment) =>
      new EmailService(new Mailgun(FormData), env),
    inject: [Environment],
  },
  {
    provide: LanguageService,
    useClass: LangService,
    scope: Scope.REQUEST,
  },
];

@Module({
  providers: [...providers],
  imports: [ConfigurationModule, WebModule],
  exports: providers,
})
@Global()
export class InfrastructureModule {}
