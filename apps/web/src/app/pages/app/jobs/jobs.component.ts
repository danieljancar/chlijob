import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { ContractService } from '../../../core/services/contract.service';
import { NotificationService } from '../../../core/services/notification.service';
import type { ApplicationWithProfile, ContractWithDetails } from '../../../core/types';
import { JobStatusBadgeComponent } from '../../../shared/components/job-status-badge/job-status-badge.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { CategoryLabelPipe } from '../../../shared/pipes/category-label.pipe';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    DecimalPipe,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    JobStatusBadgeComponent,
    StarRatingComponent,
    CategoryLabelPipe,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent implements OnInit {
  private router = inject(Router);
  private contractService = inject(ContractService);
  private notify = inject(NotificationService);

  protected contracts = signal<ContractWithDetails[]>([]);
  protected applicationMap = signal<Map<number, ApplicationWithProfile[]>>(new Map());
  protected loading = signal(true);
  protected actionInProgress = signal<number | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadContracts();
  }

  private async loadContracts(): Promise<void> {
    this.loading.set(true);
    this.contracts.set(await this.contractService.getMyContracts());
    this.loading.set(false);
  }

  protected navigateToCreate(): void {
    this.router.navigate(['/app/jobs/create']);
  }

  protected async loadApplications(contractId: number): Promise<void> {
    if (this.applicationMap().has(contractId)) return;
    const apps = await this.contractService.getContractApplications(contractId);
    this.applicationMap.update((m) => new Map(m).set(contractId, apps));
  }

  protected async accept(applicationId: number, contractId: number): Promise<void> {
    this.actionInProgress.set(applicationId);
    const { error } = await this.contractService.acceptApplication(applicationId);
    if (error) {
      this.notify.error('NOTIFY.APPLICATION_ACTION_ERROR');
    } else {
      this.notify.success('NOTIFY.APPLICATION_ACCEPTED');
      this.applicationMap.update((m) => {
        const updated = new Map(m);
        updated.delete(contractId);
        return updated;
      });
      await this.loadContracts();
      await this.loadApplications(contractId);
    }
    this.actionInProgress.set(null);
  }

  protected async reject(applicationId: number, contractId: number): Promise<void> {
    this.actionInProgress.set(applicationId);
    const { error } = await this.contractService.rejectApplication(applicationId);
    if (error) {
      this.notify.error('NOTIFY.APPLICATION_ACTION_ERROR');
    } else {
      this.notify.success('NOTIFY.APPLICATION_REJECTED');
      this.applicationMap.update((m) => {
        const apps = m.get(contractId) ?? [];
        const updated = new Map(m).set(
          contractId,
          apps.map((a) => (a.id === applicationId ? { ...a, status: 'rejected' as const } : a)),
        );
        return updated;
      });
    }
    this.actionInProgress.set(null);
  }

  protected getApplications(contractId: number): ApplicationWithProfile[] {
    return this.applicationMap().get(contractId) ?? [];
  }
}
