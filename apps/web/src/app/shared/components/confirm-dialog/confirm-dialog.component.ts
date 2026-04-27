import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

export interface ConfirmDialogData {
  titleKey?: string;
  messageKey: string;
  messageParams?: Record<string, unknown>;
  confirmKey?: string;
  cancelKey?: string;
  destructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data.titleKey ?? 'DIALOG.CONFIRM_TITLE' | translate }}</h2>
    <mat-dialog-content>
      <p>{{ data.messageKey | translate: data.messageParams ?? {} }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">
        {{ data.cancelKey ?? 'COMMON.CANCEL' | translate }}
      </button>
      <button mat-flat-button [color]="data.destructive ? 'warn' : 'primary'" (click)="confirm()">
        {{ data.confirmKey ?? 'DIALOG.CONFIRM' | translate }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ConfirmDialogComponent>);

  confirm(): void {
    this.ref.close(true);
  }

  cancel(): void {
    this.ref.close(false);
  }
}
