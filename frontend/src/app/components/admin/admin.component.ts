import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div class="admin-content">
        <div class="stats-container">
          <div class="stat-card">
            <h3>Total Orders</h3>
            <p class="stat-value">0</p>
          </div>
          <div class="stat-card">
            <h3>Total Products</h3>
            <p class="stat-value">0</p>
          </div>
          <div class="stat-card">
            <h3>Total Users</h3>
            <p class="stat-value">0</p>
          </div>
          <div class="stat-card">
            <h3>Total Revenue</h3>
            <p class="stat-value">$0</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 2rem;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
    }

    .admin-content {
      margin-top: 2rem;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;

      h3 {
        color: #666;
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
      }

      .stat-value {
        color: #333;
        font-size: 2rem;
        font-weight: bold;
        margin: 0;
      }

      &:hover {
        transform: translateY(-2px);
        transition: transform 0.2s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    }
  `]
})
export class AdminComponent {
  constructor() { }
}
