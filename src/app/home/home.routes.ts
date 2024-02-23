import { Route } from '@angular/router';

export const HOME_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./home.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./ui/nothing-to-display.component'),
      },
      {
        path: ':id',
        loadComponent: () => import('./conversation/conversation.component'),
      },
    ],
  },
];
