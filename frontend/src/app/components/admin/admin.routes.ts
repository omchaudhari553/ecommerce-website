import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes')
      .then(m => m.PRODUCTS_ROUTES)
  }
];
