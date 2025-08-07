import { Route } from '@angular/router';
import { authGuardFn } from '../../guard';

export const appRoutes: Route[] = [
  {
    path: 'qr',
    loadComponent: () =>
      import('./qr-generator.component').then((x) => x.QrGeneratorComponent),
  },
  {
    path: '',
    canActivateChild: [authGuardFn],
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((x) => x.DASHBOARD_ROUTES),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((x) => x.LoginComponent),
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
