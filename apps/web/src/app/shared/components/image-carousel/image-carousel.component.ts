import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    @if (images().length > 0) {
      <div class="carousel">
        <img
          class="carousel__image"
          [src]="currentImage()"
          [alt]="'Image ' + (currentIndex() + 1)"
        />

        @if (images().length > 1) {
          <button
            mat-icon-button
            class="carousel__nav carousel__nav--prev"
            (click)="prev(); $event.stopPropagation()"
          >
            <mat-icon>chevron_left</mat-icon>
          </button>
          <button
            mat-icon-button
            class="carousel__nav carousel__nav--next"
            (click)="next(); $event.stopPropagation()"
          >
            <mat-icon>chevron_right</mat-icon>
          </button>

          <div class="carousel__dots">
            @for (img of images(); track $index) {
              <span
                class="carousel__dot"
                [class.carousel__dot--active]="$index === currentIndex()"
                (click)="goTo($index); $event.stopPropagation()"
              ></span>
            }
          </div>
        }
      </div>
    }
  `,
  styles: `
    .carousel {
      position: relative;
      width: 100%;
      aspect-ratio: 16/9;
      overflow: hidden;
      border-radius: 8px;
      background: var(--mat-sys-surface-container);
    }

    .carousel__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .carousel__nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.4) !important;
      color: white !important;
    }

    .carousel__nav--prev {
      left: 4px;
    }
    .carousel__nav--next {
      right: 4px;
    }

    .carousel__dots {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
    }

    .carousel__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: background 0.2s;
    }

    .carousel__dot--active {
      background: white;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCarouselComponent {
  images = input.required<string[]>();

  protected currentIndex = signal(0);
  protected currentImage = computed(() => this.images()[this.currentIndex()]);

  protected prev(): void {
    this.currentIndex.update((i) => (i === 0 ? this.images().length - 1 : i - 1));
  }

  protected next(): void {
    this.currentIndex.update((i) => (i === this.images().length - 1 ? 0 : i + 1));
  }

  protected goTo(index: number): void {
    this.currentIndex.set(index);
  }
}
