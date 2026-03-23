import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SWISS_CANTONS } from '../../../core/types';
import {
  ImageUploaderComponent,
  ImageUploadResult,
} from '../../../shared/components/image-uploader';
import {
  SwissPhoneDirective,
  swissPhoneValidator,
} from '../../../shared/directives/swiss-phone.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
    ImageUploaderComponent,
    SwissPhoneDirective,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  protected auth = inject(AuthService);
  protected notify = inject(NotificationService);
  protected readonly cantons = SWISS_CANTONS;

  protected saving = signal(false);
  private formPopulated = signal(false);

  protected form = new FormGroup({
    first_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    last_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true, validators: [swissPhoneValidator] }),
    location: new FormControl('', { nonNullable: true }),
    bio: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const p = this.auth.profile();
      if (p && !this.formPopulated()) {
        this.form.patchValue({
          first_name: p.first_name ?? '',
          last_name: p.last_name ?? '',
          phone: p.phone ?? '',
          location: p.location ?? '',
          bio: p.bio ?? '',
        });
        this.form.markAsPristine();
        this.formPopulated.set(true);
      }
    });
  }

  protected async save(): Promise<void> {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);

    const v = this.form.getRawValue();
    const { error } = await this.auth.updateProfile({
      first_name: v.first_name.trim(),
      last_name: v.last_name.trim(),
      phone: v.phone.trim() || null,
      location: v.location || null,
      bio: v.bio.trim() || null,
    });

    if (error) {
      this.notify.error('NOTIFY.PROFILE_SAVE_ERROR');
    } else {
      this.form.markAsPristine();
      this.notify.success('NOTIFY.PROFILE_SAVE_SUCCESS');
    }
    this.saving.set(false);
  }

  protected async onAvatarUploaded(result: ImageUploadResult): Promise<void> {
    const { error } = await this.auth.updateProfile({
      avatar_path: result.path,
      avatar_blurhash: result.blurhash,
    });
    if (error) {
      this.notify.error('NOTIFY.PROFILE_SAVE_ERROR');
    } else {
      this.notify.success('NOTIFY.AVATAR_UPLOAD_SUCCESS');
    }
  }

  protected async signOut(): Promise<void> {
    this.notify.success('NOTIFY.LOGOUT_SUCCESS');
    await this.auth.signOut();
  }

  protected get userId(): string {
    return this.auth.session()?.user.id ?? '';
  }

  protected get email(): string {
    return this.auth.session()?.user.email ?? '';
  }

  protected get lastSignIn(): string | null {
    return this.auth.session()?.user.last_sign_in_at ?? null;
  }

  protected get createdAt(): string | null {
    return this.auth.session()?.user.created_at ?? null;
  }
}
