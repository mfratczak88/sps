export namespace UiActions {
  export class ShowToast {
    static readonly type = '[Toast] Show';

    constructor(readonly textKey: string) {}
  }

  export class LangChanged {
    static readonly type = '[Navbar] Language changed';

    constructor(readonly lang: string) {}
  }
}
