import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslatePipe],
  template: `<h2>{{ 'DASHBOARD.TITLE' | translate }}</h2>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
