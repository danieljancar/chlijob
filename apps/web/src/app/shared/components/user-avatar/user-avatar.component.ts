import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  template: `
    <div
      class="avatar"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.font-size.px]="size() * 0.36"
    >
      @if (avatarUrl()) {
        <img [src]="avatarUrl()!" [alt]="initials()" />
      } @else {
        <span>{{ initials() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .avatar {
        border-radius: 50%;
        background: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        flex-shrink: 0;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  readonly size = input<number>(36);
  readonly avatarUrl = input<string | null>(null);
  readonly initials = input<string>('?');
}
