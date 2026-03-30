import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CtaBanner } from '../../../shared/components/cta-banner/cta-banner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CtaBanner],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
