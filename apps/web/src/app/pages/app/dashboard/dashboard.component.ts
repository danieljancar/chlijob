import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import type { GiverDashboardData, TakerDashboardData } from '../../../core/types';
import { TakerViewComponent } from './components/taker-view/taker-view.component';
import { GiverViewComponent } from './components/giver-view/giver-view.component';

type DashboardView = 'taker' | 'giver';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    TakerViewComponent,
    GiverViewComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected auth = inject(AuthService);
  private dashboardService = inject(DashboardService);

  protected activeView = signal<DashboardView>('taker');
  protected takerData = signal<TakerDashboardData | null>(null);
  protected giverData = signal<GiverDashboardData | null>(null);
  protected loading = signal(false);

  protected pendingCount = computed(() => {
    if (this.activeView() === 'taker') {
      return this.takerData()?.pendingApplicationsCount ?? 0;
    }
    return this.giverData()?.pendingApplicationsCount ?? 0;
  });

  protected activeCount = computed(() => this.takerData()?.activeContracts.length ?? 0);

  async ngOnInit(): Promise<void> {
    const role = this.auth.profile()?.preferred_role ?? 'taker';
    this.activeView.set(role as DashboardView);
    await this.loadView(role as DashboardView);
  }

  protected async switchView(view: DashboardView): Promise<void> {
    this.activeView.set(view);
    await this.loadView(view);
  }

  private async loadView(view: DashboardView): Promise<void> {
    if (view === 'taker' && this.takerData()) return;
    if (view === 'giver' && this.giverData()) return;

    this.loading.set(true);
    if (view === 'taker') {
      this.takerData.set(await this.dashboardService.getTakerData());
    } else {
      this.giverData.set(await this.dashboardService.getGiverData());
    }
    this.loading.set(false);
  }

  protected async reloadGiverData(): Promise<void> {
    this.giverData.set(null);
    await this.loadView('giver');
  }
}
