import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContractService } from '../../../core/services/contract.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SWISS_CANTONS } from '../../../core/types';
import type { Category, ContractWithDetails } from '../../../core/types';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { CategoryLabelPipe } from '../../../shared/pipes/category-label.pipe';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    TranslatePipe,
    JobCardComponent,
    CategoryLabelPipe,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  private contractService = inject(ContractService);
  private notify = inject(NotificationService);
  private translate = inject(TranslateService);

  protected readonly cantons = SWISS_CANTONS;

  protected categories = signal<Category[]>([]);
  protected translatedCategories = signal<Category[]>([]);
  protected contracts = signal<ContractWithDetails[]>([]);
  protected appliedIds = signal<Set<number>>(new Set());
  protected applyingId = signal<number | null>(null);
  protected loading = signal(true);

  protected filters = new FormGroup({
    categoryId: new FormControl<number | null>(null),
    location: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    const all = await this.contractService.getCategories();
    this.categories.set(all);
    this.translatedCategories.set(
      all.filter((c) => {
        if (!c.slug) return false;
        const key = `CATEGORIES.${c.slug}`;
        return this.translate.instant(key) !== key;
      }),
    );
    await this.search();

    this.filters.valueChanges.subscribe(() => this.search());
  }

  protected resetFilters(): void {
    this.filters.reset({ categoryId: null, location: null });
  }

  protected hasActiveFilters(): boolean {
    const v = this.filters.getRawValue();
    return v.categoryId !== null || v.location !== null;
  }

  protected async search(): Promise<void> {
    this.loading.set(true);
    const v = this.filters.getRawValue();
    this.contracts.set(
      await this.contractService.getOpenContracts({
        categoryId: v.categoryId,
        location: v.location,
      }),
    );
    this.loading.set(false);
  }

  protected async apply(contract: ContractWithDetails): Promise<void> {
    this.applyingId.set(contract.id);
    const { error } = await this.contractService.applyToContract(contract.id);
    if (error) {
      this.notify.error('NOTIFY.APPLY_ERROR');
    } else {
      this.notify.success('NOTIFY.APPLY_SUCCESS');
      this.appliedIds.update((s) => new Set(s).add(contract.id));
    }
    this.applyingId.set(null);
  }

  protected isApplied(contractId: number): boolean {
    return this.appliedIds().has(contractId);
  }
}
