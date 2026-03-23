import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [TranslatePipe],
  template: `<h2>{{ 'JOBS.TITLE' | translate }}</h2>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {}
