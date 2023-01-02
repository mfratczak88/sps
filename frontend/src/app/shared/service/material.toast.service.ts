import { Injectable, NgZone } from '@angular/core';
import { ToastService } from '../../core/service/toast.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ToastKeys } from '../../core/translation-keys';

@Injectable()
export class MaterialToastService implements ToastService {
  constructor(
    private readonly snackBarRef: MatSnackBar,
    private readonly translateService: TranslateService,
    private readonly ngZone: NgZone,
  ) {}

  show(text: string | string[]): void {
    this.ngZone.run(() => {
      const translatedText = Array.isArray(text)
        ? text.join(',')
        : this.translateService.instant(text);
      this.snackBarRef.open(
        translatedText || text,
        this.translateService.instant(ToastKeys.DISMISS),
        {
          duration: 3000,
        },
      );
    });
  }
}
