import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Login } from './features/auth/login';
import { Register } from './features/auth/register';
import { Profile } from './features/profile/profile';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'profile', component: Profile },
    { path: '**', redirectTo: '' }
];
