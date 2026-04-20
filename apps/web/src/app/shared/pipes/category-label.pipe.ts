import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'categoryLabel', standalone: true })
export class CategoryLabelPipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(slug: string | null | undefined): string | null {
    if (!slug) return null;
    const key = `CATEGORIES.${slug}`;
    const translated = this.translate.instant(key);
    return translated === key ? null : translated;
  }
}
