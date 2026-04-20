import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type StatCardColor = 'green' | 'amber' | 'purple' | 'blue';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="stat-card">
      <div class="stat-icon" [class]="'stat-icon--' + color()">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <div class="stat-body">
        <span class="stat-value">{{ value() }}</span>
        <span class="stat-label">{{ label() }}</span>
        <span class="stat-sublabel" [class]="'stat-sublabel--' + color()">{{ sublabel() }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .stat-card {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        background: var(--mat-sys-surface-container-low);
        border-radius: 16px;
        padding: 18px 20px;
        flex: 1;
        min-width: 160px;
      }
      .stat-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .stat-icon--green {
        background: #dcfce7;
        color: #16a34a;
      }
      .stat-icon--amber {
        background: #fef9c3;
        color: #ca8a04;
      }
      .stat-icon--purple {
        background: #ede9fe;
        color: #7c3aed;
      }
      .stat-icon--blue {
        background: #dbeafe;
        color: #2563eb;
      }
      .stat-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .stat-value {
        font-size: 22px;
        font-weight: 700;
        line-height: 1.2;
      }
      .stat-label {
        font-size: 13px;
        color: var(--mat-sys-on-surface-variant);
      }
      .stat-sublabel {
        font-size: 12px;
        font-weight: 500;
        margin-top: 2px;
      }
      .stat-sublabel--green {
        color: #16a34a;
      }
      .stat-sublabel--amber {
        color: #ca8a04;
      }
      .stat-sublabel--purple {
        color: #7c3aed;
      }
      .stat-sublabel--blue {
        color: #2563eb;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  icon = input.required<string>();
  value = input.required<string | number>();
  label = input.required<string>();
  sublabel = input('');
  color = input<StatCardColor>('blue');
}
