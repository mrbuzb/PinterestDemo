import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/pins',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'verify-code',
    loadComponent: () => import('./components/auth/verify-code/verify-code.component').then(m => m.VerifyCodeComponent)
  },
  {
    path: 'pins',
    loadComponent: () => import('./components/pins/pin-grid/pin-grid.component').then(m => m.PinGridComponent)
  },
  {
    path: 'create-pin',
    loadComponent: () => import('./components/pins/create-pin/create-pin.component').then(m => m.CreatePinComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-pins',
    loadComponent: () => import('./components/pins/user-pins/user-pins.component').then(m => m.UserPinsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pin/:id',
    loadComponent: () => import('./components/pins/pin-detail/pin-detail.component').then(m => m.PinDetailComponent)
  },
  {
    path: '**',
    redirectTo: '/pins'
  }
];