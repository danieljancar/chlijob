import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [TranslatePipe],
  template: `<h2>{{ 'SEARCH.TITLE' | translate }}</h2>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {}
