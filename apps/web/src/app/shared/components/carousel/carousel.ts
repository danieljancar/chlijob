import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

interface CarouselItem {
  image: string;
  title?: string;
  subtitle?: string;
}

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, MatIcon],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements OnInit, OnDestroy {
  @Input() carouselItems: CarouselItem[] = [];
  @Input() autoPlay = true;
  @Input() interval = 4000;

  currentIndex = 0;
  private timer: any;
  private touchStartX = 0;

  ngOnInit() {
    if (this.autoPlay) this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.carouselItems.length) % this.carouselItems.length;
    this.restart();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
    this.restart();
  }

  goTo(index: number) {
    this.currentIndex = index;
    this.restart();
  }

  public startTimer() {
    this.timer = setInterval(() => this.next(), this.interval);
  }

  public stopTimer() {
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

  public restart() {
    if (this.autoPlay) {
      this.stopTimer();
      this.startTimer();
    }
  }
}
