import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  success(messageKey: string): void {
    this.open(messageKey, 'snack-success', 4000);
  }

  warning(messageKey: string): void {
    this.open(messageKey, 'snack-warning', 5000);
  }

  error(messageKey: string): void {
    this.open(messageKey, 'snack-error', 6000);
  }

  private open(messageKey: string, panelClass: string, duration: number): void {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    };
    this.snackBar.open(this.translate.instant(messageKey), undefined, config);
  }
}
