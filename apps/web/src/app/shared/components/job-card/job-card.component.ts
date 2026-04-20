import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { CategoryLabelPipe } from '../../pipes/category-label.pipe';
import type { ContractWithDetails } from '../../../core/types';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    TranslatePipe,
    StarRatingComponent,
    ImageCarouselComponent,
    CategoryLabelPipe,
  ],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobCardComponent {
  private supabase = inject(SupabaseService);

  contract = input.required<ContractWithDetails>();
  applyLabel = input<string>('JOB_CARD.APPLY');
  showApply = input(false);
  applied = input(false);
  applying = input(false);
  apply = output<ContractWithDetails>();
  categoryClick = output<number>();

  protected imageUrls = computed(() =>
    (this.contract().images ?? []).map((img) =>
      this.supabase.getPublicUrl('contract-images', img.image_path),
    ),
  );
}
