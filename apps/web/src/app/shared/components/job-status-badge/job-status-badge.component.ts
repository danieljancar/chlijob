import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import type { ContractStatus } from '../../../core/types';

@Component({
  selector: 'app-job-status-badge',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <span class="badge" [class]="'badge--' + status()">
      {{ 'JOBS.STATUS_' + status().toUpperCase() | translate }}
    </span>
  `,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
      }
      .badge--open {
        background: #dbeafe;
        color: #1e40af;
      }
      .badge--assigned {
        background: #fef9c3;
        color: #854d0e;
      }
      .badge--completed {
        background: #dcfce7;
        color: #166534;
      }
      .badge--canceled {
        background: #fee2e2;
        color: #991b1b;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobStatusBadgeComponent {
  status = input.required<ContractStatus>();
}
