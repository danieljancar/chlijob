import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { StarRatingComponent } from '../../../../../shared/components/star-rating/star-rating.component';
import { CategoryLabelPipe } from '../../../../../shared/pipes/category-label.pipe';
import { CtaBanner } from '../../../../../shared/components/cta-banner/cta-banner';
import { ContractService } from '../../../../../core/services/contract.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import type { GiverDashboardData } from '../../../../../core/types';

@Component({
  selector: 'app-giver-view',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    StatCardComponent,
    StarRatingComponent,
    CategoryLabelPipe,
    CtaBanner,
  ],
  templateUrl: './giver-view.component.html',
  styleUrl: './giver-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiverViewComponent {
  private contractService = inject(ContractService);
  private notify = inject(NotificationService);

  data = input.required<GiverDashboardData>();
  actionTaken = output<void>();

  protected actionInProgress = signal<number | null>(null);

  protected async accept(applicationId: number): Promise<void> {
    this.actionInProgress.set(applicationId);
    const { error } = await this.contractService.acceptApplication(applicationId);
    if (error) {
      this.notify.error('NOTIFY.APPLICATION_ACTION_ERROR');
    } else {
      this.notify.success('NOTIFY.APPLICATION_ACCEPTED');
      this.actionTaken.emit();
    }
    this.actionInProgress.set(null);
  }

  protected async reject(applicationId: number): Promise<void> {
    this.actionInProgress.set(applicationId);
    const { error } = await this.contractService.rejectApplication(applicationId);
    if (error) {
      this.notify.error('NOTIFY.APPLICATION_ACTION_ERROR');
    } else {
      this.notify.success('NOTIFY.APPLICATION_REJECTED');
      this.actionTaken.emit();
    }
    this.actionInProgress.set(null);
  }

  protected initials(firstName: string, lastName: string): string {
    return (firstName[0] ?? '') + (lastName[0] ?? '');
  }
}
