import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { PublicLayoutComponent } from './layout/public/public-layout.component';
import { AppLayoutComponent } from './layout/app/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/public/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/public/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'legal',
        children: [
          {
            path: 'terms',
            loadComponent: () =>
              import('./pages/public/legal/terms/terms.component').then((m) => m.TermsComponent),
          },
          {
            path: 'privacy',
            loadComponent: () =>
              import('./pages/public/legal/privacy/privacy.component').then(
                (m) => m.PrivacyComponent,
              ),
          },
        ],
      },
      {
        path: 'auth',
        canActivate: [guestGuard],
        children: [
          {
            path: 'login',
            loadComponent: () =>
              import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
          },
          {
            path: 'register',
            loadComponent: () =>
              import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
          },
          { path: '', redirectTo: 'login', pathMatch: 'full' },
        ],
      },
    ],
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/app/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'jobs',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./pages/app/jobs/jobs.component').then((m) => m.JobsComponent),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./pages/app/jobs/create-job/create-job.component').then(
                (m) => m.CreateJobComponent,
              ),
          },
        ],
      },
      {
        path: 'job/:id',
        loadComponent: () =>
          import('./pages/app/job-detail/job-detail.component').then((m) => m.JobDetailComponent),
      },
      {
        path: 'contracts',
        loadComponent: () =>
          import('./pages/app/contracts/contracts.component').then((m) => m.ContractsComponent),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./pages/app/search/search.component').then((m) => m.SearchComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/app/profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
