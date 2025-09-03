import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'group/:id',
    loadComponent: () => import('./components/group-detail/group-detail.component').then(m => m.GroupDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'join/:token',
    loadComponent: () => import('./components/join-group/join-group.component').then(m => m.JoinGroupComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
