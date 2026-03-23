import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

// Validates the local part entered into the input (without +41 prefix).
// Expected format: XX XXX XX XX (e.g. 79 123 45 67)
export function swissPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const v = (control.value ?? '').trim();
  if (!v) return null;
  return /^\d{2} \d{3} \d{2} \d{2}$/.test(v) ? null : { swissPhone: true };
}

@Directive({
  selector: 'input[appSwissPhone]',
  standalone: true,
  host: { '(input)': 'onInput($event)' },
})
export class SwissPhoneDirective {
  private formatting = false;

  onInput(event: Event): void {
    if (this.formatting) return;
    const input = event.target as HTMLInputElement;
    const formatted = SwissPhoneDirective.format(input.value);
    if (formatted !== input.value) {
      this.formatting = true;
      const cursor = input.selectionStart ?? 0;
      const diff = formatted.length - input.value.length;
      input.value = formatted;
      input.setSelectionRange(cursor + diff, cursor + diff);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      this.formatting = false;
    }
  }

  // Formats digits into XX XXX XX XX (max 9 digits, local part without country code)
  static format(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 9);
    let out = '';
    if (digits.length > 0) out += digits.slice(0, 2);
    if (digits.length > 2) out += ' ' + digits.slice(2, 5);
    if (digits.length > 5) out += ' ' + digits.slice(5, 7);
    if (digits.length > 7) out += ' ' + digits.slice(7, 9);
    return out;
  }
}
