import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DialogRef<ResultType> {
  afterClosed(): Observable<ResultType>;
}

@Injectable()
export abstract class AbstractDialog {
  abstract open<CompType, Data = unknown, Result = unknown>(
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
