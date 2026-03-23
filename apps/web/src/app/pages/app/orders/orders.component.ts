import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [TranslatePipe],
  template: `<h2>{{ 'ORDERS.TITLE' | translate }}</h2>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {}
