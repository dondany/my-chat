import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.routes').then((m) => m.HOME_ROUTES),
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
