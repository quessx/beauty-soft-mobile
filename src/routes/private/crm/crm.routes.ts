import { Routes } from '@angular/router';
import { AppointmentLogPageRoutes } from '@routes/private/appointment-log/appointment-log.routes';

export const CrmPageRoutes: Routes = [
    {
        path: 'crm',
        loadComponent: () => import( '@pages/private/crm-page/' ).then( ( m ) => m.CrmPageComponent ),
        canActivate: [],
        canActivateChild: [],
        children: [
            {
                path: 'booking',
                loadComponent: () => import( '@pages/private/appointment-log' ).then( ( m ) => m.AppointmentLogComponent ),
                children: AppointmentLogPageRoutes,
                data: {
                    title: "nav_items_title.booking"
                }
            },
            {
                path: '',
                redirectTo: 'booking',
                pathMatch: 'full'
            },
        ],
        data: {
            title: "front_general.titles.booking"
        },
    },
];
