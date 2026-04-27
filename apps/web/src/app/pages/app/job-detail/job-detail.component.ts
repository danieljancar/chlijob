import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ContractService } from '../../../core/services/contract.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { ImageCarouselComponent } from '../../../shared/components/image-carousel/image-carousel.component';
import { CategoryLabelPipe } from '../../../shared/pipes/category-label.pipe';
import type { ContractWithDetails } from '../../../core/types';
import { DialogService } from '../../../core/services/dialog.service';
import { JobStatusBadgeComponent } from '../../../shared/components/job-status-badge/job-status-badge.component';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    TranslatePipe,
    StarRatingComponent,
    ImageCarouselComponent,
    CategoryLabelPipe,
    JobStatusBadgeComponent,
  ],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contractService = inject(ContractService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private supabase = inject(SupabaseService);
  private dialog = inject(DialogService);

  protected contract = signal<ContractWithDetails | null>(null);
  protected loading = signal(true);
  protected applying = signal(false);
  protected applied = signal(false);
  protected userRating = signal(0);
  protected reviewSubmitting = signal(false);
  protected commentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  protected imageUrls = computed(() =>
    (this.contract()?.images ?? []).map((img) =>
      this.supabase.getPublicUrl('contract-images', img.image_path),
    ),
  );

  protected isOwnContract = computed(() => {
    const userId = this.auth.session()?.user.id;
    return !!userId && this.contract()?.creator_id === userId;
  });

  protected isAppliedTaker = computed(() => {
    const userId = this.auth.session()?.user.id;
    return !!userId && this.contract()?.taker_id === userId;
  });

  protected isOpen = computed(() => this.contract()?.status === 'open');

  protected isReviewFilledOut = computed(async () => {
    const userId = this.auth.session()?.user.id;
    const contractId = this.contract()?.id ?? 0;

    if (!userId || !contractId) return false;

    return await this.contractService.hasReviewed(userId, contractId);
  });

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      await this.router.navigate(['/app/search']);
      return;
    }

    const [contract, hasApplied] = await Promise.all([
      this.contractService.getContractById(id),
      this.contractService.hasApplied(id),
    ]);

    if (!contract) {
      await this.router.navigate(['/app/search']);
      return;
    }

    this.contract.set(contract);
    this.applied.set(hasApplied);
    this.loading.set(false);
  }

  protected async apply(): Promise<void> {
    const contract = this.contract();
    if (!contract || this.applying()) return;

    this.applying.set(true);
    const { error } = await this.contractService.applyToContract(contract.id);
    if (error) {
      this.notify.error('NOTIFY.APPLY_ERROR');
    } else {
      this.notify.success('NOTIFY.APPLY_SUCCESS');
      this.applied.set(true);
    }
    this.applying.set(false);
  }

  protected filterByCategory(categoryId: number | null): void {
    if (!categoryId) return;
    this.router.navigate(['/app/search'], { queryParams: { categoryId } });
  }

  protected goBack(): void {
    this.router.navigate(['/app/search']);
  }

  protected async cancelApplication(): Promise<void> {
    const contract = this.contract();
    if (!contract) return;

    if (!this.isAppliedTaker()) {
      this.notify.error('NOTIFY.APPLICATION_ACTION_ERROR');
      return;
    }

    this.dialog
      .confirm({
        messageKey: 'JOB_DETAIL.CANCEL_CONFIRM',
        destructive: true,
      })
      .subscribe(async (confirmed) => {
        if (confirmed) {
          const { error } = await this.contractService.cancelApplication(contract.id);

          if (error) {
            this.notify.error('NOTIFY.CANCEL_JOB_ERROR');
          } else {
            this.notify.success('NOTIFY.CANCEL_JOB_SUCCESS');
            this.applied.set(false);
          }
        }
      });
  }

  protected async completeJob(): Promise<void> {
    const contract = this.contract();
    if (!contract) return;

    if (!this.isOwnContract()) {
      this.notify.error('NOTIFY.APPLICATION_ACTION_ERROR');
      return;
    }

    this.dialog
      .confirm({
        messageKey: 'JOB_DETAIL.COMPLETE_CONFIRM',
      })
      .subscribe(async (confirmed) => {
        if (confirmed) {
          const { error } = await this.contractService.completeJob(contract.id);

          if (error) {
            this.notify.error('NOTIFY.APPLICATION_ACTION_ERROR');
          } else {
            this.notify.success('NOTIFY.COMPLETE_JOB_SUCCESS');
            // Refresh contract details to show updated status
            const updatedContract = await this.contractService.getContractById(contract.id);
            this.contract.set(updatedContract);
          }
        }
      });
  }

  protected onRatingChange(rating: number): void {
    this.userRating.set(rating);
  }

  protected async reviewJob(): Promise<void> {
    const contract = this.contract();
    if (!contract || contract.status !== 'completed' || this.reviewSubmitting()) return;

    if (!this.isOwnContract() && !this.isAppliedTaker()) {
      this.notify.error('NOTIFY.APPLICATION_ACTION_ERROR');
      return;
    }

    if (!this.userRating() || this.commentControl.invalid) {
      this.commentControl.markAsTouched();
      return;
    }

    this.reviewSubmitting.set(true);
    const { error } = await this.contractService.reviewJob(
      contract.id,
      this.userRating(),
      this.commentControl.value.trim(),
      this.isOwnContract() ? 'creator' : 'taker',
    );

    if (error) {
      this.notify.error('NOTIFY.REVIEW_JOB_ERROR');
      this.reviewSubmitting.set(false);
      return;
    }

    this.notify.success('NOTIFY.REVIEW_JOB_SUCCESS');
    this.reviewSubmitting.set(false);
    this.commentControl.reset('');
    this.userRating.set(0);
  }
}
