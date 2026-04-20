import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContractService } from '../../../../core/services/contract.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CategoryLabelPipe } from '../../../../shared/pipes/category-label.pipe';
import type { Category } from '../../../../core/types';

@Component({
  selector: 'app-create-job-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
    CategoryLabelPipe,
  ],
  templateUrl: './create-job-dialog.component.html',
  styleUrl: './create-job-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateJobDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<CreateJobDialogComponent>);
  private contractService = inject(ContractService);
  private notify = inject(NotificationService);
  private translate = inject(TranslateService);

  protected categories = signal<Category[]>([]);
  protected saving = signal(false);

  protected form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    category_id: new FormControl<number | null>(null),
    salary_per_hour: new FormControl<number | null>(null, [Validators.min(1)]),
    estimated_hours: new FormControl<number | null>(null, [Validators.min(0.5)]),
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

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);

    const v = this.form.getRawValue();
    const { error } = await this.contractService.createContract({
      title: v.title.trim(),
      description: v.description.trim() || null,
      category_id: v.category_id,
      salary_per_hour: v.salary_per_hour,
      estimated_hours: v.estimated_hours,
      address: v.address.trim() || null,
      preferred_date: v.preferred_date || null,
    });

    if (error) {
      this.notify.error('NOTIFY.CREATE_JOB_ERROR');
    } else {
      this.notify.success('NOTIFY.CREATE_JOB_SUCCESS');
      this.dialogRef.close(true);
    }
    this.saving.set(false);
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
