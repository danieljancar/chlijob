import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { ContractService } from '../../../core/services/contract.service';
import type { ContractWithDetails } from '../../../core/types';
import { JobStatusBadgeComponent } from '../../../shared/components/job-status-badge/job-status-badge.component';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    RouterLink,
    TranslatePipe,
    JobStatusBadgeComponent,
  ],
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractsComponent implements OnInit {
  private contractService = inject(ContractService);
  protected auth = inject(AuthService);

  protected contracts = signal<ContractWithDetails[]>([]);
  protected loading = signal(true);

  async ngOnInit(): Promise<void> {
    this.contracts.set(await this.contractService.getUserActiveContracts());
    this.loading.set(false);
  }

  protected activeContracts(): ContractWithDetails[] {
    return this.contracts().filter((c) => c.status === 'assigned');
  }

  protected historyContracts(): ContractWithDetails[] {
    return this.contracts().filter((c) => c.status === 'completed' || c.status === 'canceled');
  }

  protected isMyContract(contract: ContractWithDetails): boolean {
    return contract.creator_id === this.auth.session()?.user.id;
  }
}
