import { Route } from '@angular/router'

export const HOME_ROUTES: Route[] = [
    {
        path: '',
        loadComponent: () => import('./home.component'),
        children: [
            {
                path: 'profile/:id',
                loadComponent: () => import('./profile/profile.component')
            },
            {
                path: ':id',
                loadComponent: () => import('./conversation/conversation.component') 
            },
        ],
    },
]