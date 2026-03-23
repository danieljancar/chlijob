import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { encode } from 'blurhash';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { SupabaseService } from '../../../core/services/supabase.service';

export interface ImageUploadResult {
  path: string;
  publicUrl: string;
  blurhash: string;
}

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploaderComponent {
  private supabase = inject(SupabaseService);

  readonly bucket = input.required<string>();
  readonly uploadPath = input.required<string>();
  readonly existingUrl = input<string | null>(null);
  readonly existingBlurhash = input<string | null>(null);
  readonly shape = input<'circle' | 'square'>('circle');
  readonly accept = input<string>('image/jpeg,image/png,image/webp');

  readonly uploaded = output<ImageUploadResult>();
  readonly uploadError = output<string>();

  protected fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected loading = signal(false);
  protected previewUrl = signal<string | null>(null);
  protected blurhashCanvas = signal<string | null>(null);

  protected displayUrl = computed(() => this.previewUrl() ?? this.existingUrl());
  protected isCircle = computed(() => this.shape() === 'circle');

  openFilePicker(): void {
    this.fileInput().nativeElement.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.loading.set(true);

    try {
      const blurhash = await this.generateBlurhash(file);
      const previewDataUrl = await this.readAsDataUrl(file);
      this.previewUrl.set(previewDataUrl);
      this.blurhashCanvas.set(null);

      const ext = file.name.split('.').pop() ?? 'jpg';
      const fileName = `${Date.now()}.${ext}`;
      const fullPath = `${this.uploadPath()}/${fileName}`;

      const { error } = await this.supabase
        .storage(this.bucket())
        .upload(fullPath, file, { upsert: true });

      if (error) {
        this.uploadError.emit(error.message);
        this.previewUrl.set(null);
        return;
      }

      const publicUrl = this.supabase.getPublicUrl(this.bucket(), fullPath);
      this.uploaded.emit({ path: fullPath, publicUrl, blurhash });
    } finally {
      this.loading.set(false);
      input.value = '';
    }
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private generateBlurhash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context unavailable'));
        ctx.drawImage(img, 0, 0, size, size);
        const imageData = ctx.getImageData(0, 0, size, size);
        const hash = encode(imageData.data, size, size, 4, 4);
        resolve(hash);
      };

      img.onerror = reject;
      img.src = url;
    });
  }
}
