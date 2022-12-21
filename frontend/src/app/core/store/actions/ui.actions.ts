export namespace UiActions {
  export class ShowToast {
    static readonly type = '[Toast] Show';

    constructor(readonly textKey: string) {}
  }
}
