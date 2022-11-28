import { Module, Scope } from '@nestjs/common';
import { LanguageService } from '../../../application/language.service';
import { LangService } from '../lang.service';

const langServiceProvider = {
  provide: LanguageService,
  useClass: LangService,
  scope: Scope.REQUEST,
};

@Module({
  providers: [langServiceProvider],
  exports: [langServiceProvider],
})
export class LangModule {}
