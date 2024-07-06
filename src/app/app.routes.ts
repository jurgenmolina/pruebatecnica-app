// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'iniciar-sesion', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      
    ]
  },
];
