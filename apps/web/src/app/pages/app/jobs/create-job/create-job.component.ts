import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContractService } from '../../../../core/services/contract.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CategoryLabelPipe } from '../../../../shared/pipes/category-label.pipe';
import type { Category } from '../../../../core/types';

@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    TranslatePipe,
    CategoryLabelPipe,
  ],
  templateUrl: './create-job.component.html',
  styleUrl: './create-job.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateJobComponent implements OnInit {
  private router = inject(Router);
  private contractService = inject(ContractService);
  private notify = inject(NotificationService);
  private translate = inject(TranslateService);

  protected categories = signal<Category[]>([]);
  protected saving = signal(false);
  protected pendingFiles = signal<File[]>([]);
  protected previewUrls = signal<string[]>([]);

  protected form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    category_id: new FormControl<number | null>(null),
    payment_type: new FormControl<'hourly' | 'lump_sum'>('hourly', { nonNullable: true }),
    salary_per_hour: new FormControl<number | null>(null, [Validators.min(1)]),
    estimated_hours: new FormControl<number | null>(null, [Validators.min(0.5)]),
    lump_sum: new FormControl<number | null>(null, [Validators.min(1)]),
    taker_amount: new FormControl<number | null>(1, [Validators.min(1), Validators.max(20)]),
    address: new FormControl('', { nonNullable: true }),
    preferred_date: new FormControl('', { nonNullable: true }),
  });

  async ngOnInit(): Promise<void> {
    const all = await this.contractService.getCategories();
    this.categories.set(
      all.filter((c) => {
        if (!c.slug) return false;
        const key = `CATEGORIES.${c.slug}`;
        return this.translate.instant(key) !== key;
      }),
    );
  }

  protected onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const remaining = 5 - this.pendingFiles().length;
    const selected = Array.from(input.files).slice(0, remaining);

    this.pendingFiles.update((files) => [...files, ...selected]);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => this.previewUrls.update((urls) => [...urls, reader.result as string]);
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  protected removeImage(index: number): void {
    this.pendingFiles.update((files) => files.filter((_, i) => i !== index));
    this.previewUrls.update((urls) => urls.filter((_, i) => i !== index));
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);

    const v = this.form.getRawValue();
    const { id, error } = await this.contractService.createContract({
      title: v.title.trim(),
      description: v.description.trim() || null,
      category_id: v.category_id,
      payment_type: v.payment_type,
      salary_per_hour: v.salary_per_hour,
      estimated_hours: v.estimated_hours,
      lump_sum: v.lump_sum,
      taker_amount: v.taker_amount,
      address: v.address.trim() || null,
      preferred_date: v.preferred_date || null,
    });

    if (error || !id) {
      this.notify.error('NOTIFY.CREATE_JOB_ERROR');
      this.saving.set(false);
      return;
    }

    if (this.pendingFiles().length > 0) {
      await this.contractService.uploadContractImages(id, this.pendingFiles());
    }

    this.notify.success('NOTIFY.CREATE_JOB_SUCCESS');
    await this.router.navigate(['/app/jobs']);
  }

  protected cancel(): void {
    this.router.navigate(['/app/jobs']);
  }
}
