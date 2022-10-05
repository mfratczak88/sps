import { Injectable } from '@angular/core';
import { ErrorCodes } from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  translateErrorCode(errorCode: ErrorCodes, originalEnglishMessage: string) {
    return originalEnglishMessage;
  }
}
