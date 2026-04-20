import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslatePipe } from '@ngx-translate/core';

export interface ExpansionPanelItem {
  title: string;
  subtitle?: string;
  description: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-expansion-panel',
  standalone: true,
  imports: [MatExpansionModule, TranslatePipe],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent {
  items = input<ExpansionPanelItem[]>([]);
  multi = input(false);
}
