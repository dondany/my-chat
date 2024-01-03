import { Route } from '@angular/router'

export const HOME_ROUTES: Route[] = [
    {
        path: '',
        loadComponent: () => import('./home.component'),
        children: [
            {
                path: ':id',
                loadComponent: () => import('./conversation/conversation.component') 
            },
        ],
    },
]