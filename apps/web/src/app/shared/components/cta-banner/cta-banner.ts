import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cta-banner',
  imports: [MatButton, RouterLink, TranslatePipe],
  standalone: true,
  templateUrl: './cta-banner.html',
  styleUrl: './cta-banner.scss',
})
export class CtaBanner {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly actionLabel = input.required<string>();
  readonly actionUrl = input.required<string>();
}
