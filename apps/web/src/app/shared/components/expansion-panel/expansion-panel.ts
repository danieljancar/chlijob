import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

interface ExpansionPanelItem {
  title: string;
  subtitle?: string;
  description: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-expansion-panel',
  imports: [MatExpansionModule],
  templateUrl: './expansion-panel.html',
  styleUrl: './expansion-panel.scss',
})
export class ExpansionPanel implements OnInit, OnDestroy {
  @Input() items: ExpansionPanelItem[] = [];
  @Input() multi = false;
  @Input() animationDuration = '300ms';

  ngOnInit() { }

  ngOnDestroy() { }
}
