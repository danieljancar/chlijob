import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar.component';

interface NavItem {
  labelKey: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    TranslatePipe,
    UserAvatarComponent,
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {
  protected auth = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);

  protected isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((r) => r.matches)),
    { initialValue: false },
  );

  protected navItems: NavItem[] = [
    { labelKey: 'NAV.HOME', icon: 'home', route: '/app' },
    { labelKey: 'NAV.MY_JOBS', icon: 'cases', route: '/app/jobs' },
    { labelKey: 'NAV.CONTRACTS', icon: 'receipt_long', route: '/app/contracts' },
    { labelKey: 'NAV.SEARCH', icon: 'search', route: '/app/search' },
  ];
}
