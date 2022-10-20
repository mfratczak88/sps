import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class LanguageService {
  abstract get language(): string;
}
