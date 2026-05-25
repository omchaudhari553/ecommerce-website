import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { AddProductComponent } from './manage-products/add-product/add-product.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { UsersComponent } from './users/users.component';
import { AdminGuard } from '../../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'manage-products',
        component: ManageProductsComponent
      },
      {
        path: 'manage-products/new',
        component: AddProductComponent
      },
      {
        path: 'manage-orders',
        component: ManageOrdersComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { } 