import { Injectable } from '@angular/core';

@Injectable()
export abstract class ToastService {
  abstract show(text: string | string[]): void;
}
