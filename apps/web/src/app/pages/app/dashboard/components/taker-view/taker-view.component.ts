import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { JobStatusBadgeComponent } from '../../../../../shared/components/job-status-badge/job-status-badge.component';
import { StarRatingComponent } from '../../../../../shared/components/star-rating/star-rating.component';
import { CategoryLabelPipe } from '../../../../../shared/pipes/category-label.pipe';
import { CtaBanner } from '../../../../../shared/components/cta-banner/cta-banner';
import type { TakerDashboardData } from '../../../../../core/types';

@Component({
  selector: 'app-taker-view',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    StatCardComponent,
    JobStatusBadgeComponent,
    StarRatingComponent,
    CategoryLabelPipe,
    CtaBanner,
  ],
  templateUrl: './taker-view.component.html',
  styleUrl: './taker-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakerViewComponent {
  data = input.required<TakerDashboardData>();
}
