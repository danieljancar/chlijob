import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [TranslatePipe],
  template: `<h2>{{ 'CONTRACTS.TITLE' | translate }}</h2>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractsComponent {}
