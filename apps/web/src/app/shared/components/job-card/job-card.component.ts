import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CategoryLabelPipe } from '../../pipes/category-label.pipe';
import type { ContractWithDetails } from '../../../core/types';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    TranslatePipe,
    StarRatingComponent,
    CategoryLabelPipe,
  ],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobCardComponent {
  contract = input.required<ContractWithDetails>();
  applyLabel = input<string>('JOB_CARD.APPLY');
  showApply = input(false);
  applied = input(false);
  applying = input(false);
  apply = output<ContractWithDetails>();
}
