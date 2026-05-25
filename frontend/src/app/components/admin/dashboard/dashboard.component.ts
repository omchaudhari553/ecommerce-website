import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
  topProducts: any[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  };

  constructor() {}

  ngOnInit(): void {
    // TODO: Fetch real data from services
    this.loadDashboardStats();
  }

  private loadDashboardStats(): void {
    // Simulated data for now
    this.stats = {
      totalOrders: 150,
      totalProducts: 75,
      totalUsers: 500,
      totalRevenue: 25000,
      recentOrders: [
        { id: 1, customer: 'John Doe', amount: 299, status: 'Delivered' },
        { id: 2, customer: 'Jane Smith', amount: 199, status: 'Processing' },
        { id: 3, customer: 'Bob Johnson', amount: 399, status: 'Pending' }
      ],
      topProducts: [
        { id: 1, name: 'Product A', sales: 50 },
        { id: 2, name: 'Product B', sales: 45 },
        { id: 3, name: 'Product C', sales: 40 }
      ]
    };
  }
} 