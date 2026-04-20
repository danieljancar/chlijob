import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="star-rating">
      @for (star of stars; track star) {
        <mat-icon class="star" [class.filled]="star <= roundedRating()">star</mat-icon>
      }
      @if (showCount()) {
        <span class="review-count">({{ reviewCount() }})</span>
      }
    </div>
  `,
  styles: [
    `
      .star-rating {
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }
      .star {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: var(--mat-sys-outline);
      }
      .star.filled {
        color: #f59e0b;
      }
      .review-count {
        font-size: 12px;
        color: var(--mat-sys-on-surface-variant);
        margin-left: 4px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRatingComponent {
  rating = input.required<number>();
  reviewCount = input(0);
  showCount = input(true);

  protected readonly stars = [1, 2, 3, 4, 5];

  protected roundedRating(): number {
    return Math.round(this.rating());
  }
}
