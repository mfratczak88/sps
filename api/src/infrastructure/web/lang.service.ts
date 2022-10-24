import { LanguageService } from '../../application/language.service';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { getI18nContextFromRequest } from 'nestjs-i18n';
@Injectable({
  scope: Scope.REQUEST,
})
export class LangService implements LanguageService {
  constructor(@Inject(REQUEST) private readonly req: Request) {}

  get language(): string {
    const lang = getI18nContextFromRequest(this.req)?.lang;
    return lang !== 'en' && lang !== 'pl' ? 'EN' : lang.toUpperCase();
  }
}
