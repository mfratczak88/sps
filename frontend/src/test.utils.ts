import { TranslateTestingModule } from 'ngx-translate-testing';

export const translateTestModule = async () =>
  TranslateTestingModule.withTranslations(
    'pl',
    await import('./assets/i18n/pl.json'),
  ).withTranslations('en', await import('./assets/i18n/en.json'));
