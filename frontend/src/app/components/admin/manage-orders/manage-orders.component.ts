import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Order {
  id: number;
  customer: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  date: string;
}

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm = '';
  selectedStatus = 'all';
  statuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor() {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Format price in Indian Rupees
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }

  private loadOrders(): void {
    // Simulated data
    this.orders = [
      { id: 1, customer: 'John Doe', amount: 2999, status: 'Pending', date: '2024-03-15' },
      { id: 2, customer: 'Jane Smith', amount: 1599, status: 'Processing', date: '2024-03-16' },
      { id: 3, customer: 'Bob Johnson', amount: 3999, status: 'Delivered', date: '2024-03-17' },
      { id: 4, customer: 'Alice Brown', amount: 2499, status: 'Cancelled', date: '2024-03-18' },
      { id: 5, customer: 'Charlie Wilson', amount: 1799, status: 'Processing', date: '2024-03-19' },
      { id: 6, customer: 'Diana Miller', amount: 4999, status: 'Delivered', date: '2024-03-20' }
    ];
    this.filterOrders();
  }

  filterOrders(): void {
    let filtered = [...this.orders];
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.customer.toLowerCase().includes(term) ||
        order.id.toString().includes(term)
      );
    }
    
    // Apply status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order => 
        order.status === this.selectedStatus
      );
    }

    this.filteredOrders = filtered;
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filters change
  }

  getPaginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  updateOrderStatus(order: Order, newStatus: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled'): void {
    order.status = newStatus;
    // TODO: Implement API call to update status
  }
} 