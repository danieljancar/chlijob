import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private notify = inject(NotificationService);

  protected form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    birthday: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    preferredRole: new FormControl<'taker' | 'giver'>('taker', { nonNullable: true }),
  });

  protected loading = signal(false);
  protected error = signal('');
  protected showPassword = signal(false);

  protected async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const v = this.form.getRawValue();
    const birthday = v.birthday ? (v.birthday as Date).toISOString().split('T')[0] : '';

    const { error } = await this.auth.signUp(v.email, v.password, {
      first_name: v.firstName,
      last_name: v.lastName,
      birthday,
      preferred_role: v.preferredRole,
    });

    if (error) {
      this.error.set(error.message);
    } else {
      this.notify.success('NOTIFY.REGISTER_SUCCESS');
    }
    this.loading.set(false);
  }
}
