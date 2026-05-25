import { Routes } from '@angular/router';
import { Login } from './login/login'; 
import { UserPanel } from './user-panel/user-panel'; 
import { AdminPanel } from './admin-panel/admin-panel';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'user', component: UserPanel },
  { path: 'admin', component: AdminPanel },
  { path: '', redirectTo: '/login', pathMatch: 'full' } 
];