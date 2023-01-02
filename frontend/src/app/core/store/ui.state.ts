import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ToastService } from '../service/toast.service';
import { UiActions } from './actions/ui.actions';

export interface UiStateModel {
  drawerOpened: boolean;
}
const defaults: UiStateModel = {
  drawerOpened: true,
};

@State<UiStateModel>({
  name: 'ui',
  defaults,
})
@Injectable({
  providedIn: 'root',
})
export class UiState {
  constructor(private readonly toastService: ToastService) {}

  @Action(UiActions.ShowToast)
  showToast(ctx: StateContext<UiStateModel>, { textKey }: UiActions.ShowToast) {
    return this.toastService.show(textKey);
  }
}
