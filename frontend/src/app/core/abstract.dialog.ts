import { ComponentType } from '@angular/cdk/portal';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface DialogRef<ResultType> {
  afterClosed(): Observable<ResultType>;
}

@Injectable()
export abstract class AbstractDialog {
  abstract open<CompType, Data = any, Result = any>(
    component: ComponentType<CompType>,
    data: Data,
  ): DialogRef<Result>;
}

export interface ConfirmDialogProps {
  title: string;
  subTitle: string;
}
export interface ConfirmDialogProps {
  title: string;
  subTitle: string;
}
export interface ConfirmResult {
  confirmed: boolean;
}
