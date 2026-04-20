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
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { ContractService } from '../../../core/services/contract.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { ImageCarouselComponent } from '../../../shared/components/image-carousel/image-carousel.component';
import { CategoryLabelPipe } from '../../../shared/pipes/category-label.pipe';
import type { ContractWithDetails } from '../../../core/types';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    StarRatingComponent,
    ImageCarouselComponent,
    CategoryLabelPipe,
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

  protected contract = signal<ContractWithDetails | null>(null);
  protected loading = signal(true);
  protected applying = signal(false);
  protected applied = signal(false);

  protected imageUrls = computed(() =>
    (this.contract()?.images ?? []).map((img) =>
      this.supabase.getPublicUrl('contract-images', img.image_path),
    ),
  );

  protected isOwnContract = computed(() => {
    const userId = this.auth.session()?.user.id;
    return !!userId && this.contract()?.creator_id === userId;
  });

  protected isOpen = computed(() => this.contract()?.status === 'open');

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
}
