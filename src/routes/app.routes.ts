import { Routes } from '@angular/router';
import { privateRoutes } from './private';
import { publicRoutes } from './public';

export const routes: Routes = [
    ...privateRoutes,
    ...publicRoutes,
    {
        path: '',
        redirectTo: 'crm',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'crm',
        pathMatch: 'full'
    }
];
