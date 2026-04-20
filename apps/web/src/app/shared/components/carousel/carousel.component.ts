import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

export interface CarouselItem {
  image: string;
  titleKey?: string;
  subtitleKey?: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnInit, OnDestroy {
  carouselItems = input<CarouselItem[]>([]);
  autoPlay = input(true);
  interval = input(4000);

  protected currentIndex = signal(0);
  private timer: ReturnType<typeof setInterval> | undefined;
  private touchStartX = 0;

  ngOnInit() {
    if (this.autoPlay()) this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  prev() {
    this.currentIndex.update(
      (i) => (i - 1 + this.carouselItems().length) % this.carouselItems().length,
    );
    this.restart();
  }

  next() {
    this.currentIndex.update((i) => (i + 1) % this.carouselItems().length);
    this.restart();
  }

  goTo(index: number) {
    this.currentIndex.set(index);
    this.restart();
  }

  startTimer() {
    this.timer = setInterval(() => this.next(), this.interval());
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent) {
    const delta = this.touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? this.next() : this.prev();
    }
  }

  private restart() {
    if (this.autoPlay()) {
      this.stopTimer();
      this.startTimer();
    }
  }
}
