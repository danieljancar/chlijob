import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="page-container">
      <h1>{{ 'LEGAL.TERMS_TITLE' | translate }}</h1>
      <p>{{ 'LEGAL.PLACEHOLDER' | translate }}</p>
    </div>
  `,
  styles: [
    `
      .page-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 48px 24px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsComponent {}
