import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ToastService } from '../../service/toast.service';
import { UiActions } from '../actions/ui.actions';
import { TranslateService } from '@ngx-translate/core';

export type Language = {
  code: string;
  isoCode: string;
  icon: string;
  text: string;
};
const availableLanguages = {
  pl: {
    code: 'pl',
    isoCode: 'pl-PL',
    icon: 'flag-pl',
    text: 'Polski',
  },
  en: {
    code: 'en',
    isoCode: 'en-US',
    icon: 'flag-en',
    text: 'English',
  },
};

export interface UiStateModel {
  drawerOpened: boolean;
  language: Language;
  languages: {
    [lang: string]: Language;
  };
}

const defaults: UiStateModel = {
  drawerOpened: true,
  language: availableLanguages['pl'],
  languages: availableLanguages,
};

@State<UiStateModel>({
  name: 'ui',
  defaults,
})
@Injectable({
  providedIn: 'root',
})
export class UiState implements NgxsOnInit {
  constructor(
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
  ) {}

  ngxsOnInit(ctx: StateContext<UiStateModel>): void {
    const lang = localStorage.getItem('lang') || '';
    this.setLanguage(ctx, lang);
  }

  @Action(UiActions.ShowToast)
  showToast(ctx: StateContext<UiStateModel>, { textKey }: UiActions.ShowToast) {
    return this.toastService.show(textKey);
  }

  @Action(UiActions.LangChanged)
  changeLang(ctx: StateContext<UiStateModel>, { lang }: UiActions.LangChanged) {
    this.setLanguage(ctx, lang);
  }

  private setLanguage(
    { patchState }: StateContext<UiStateModel>,
    lang: string,
  ) {
    const langCode = lang === 'pl' || lang === 'en' ? lang : 'pl';
    localStorage.setItem('lang', langCode);
    patchState({ language: availableLanguages[langCode] });
    this.translateService.setDefaultLang(langCode);
  }
}
