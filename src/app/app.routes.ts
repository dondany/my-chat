import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.routes').then((m) => m.HOME_ROUTES),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
