import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../../../services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchQuery = '';
  selectedStatus = '';
  selectedDateRange = 'all';
  startDate = '';
  endDate = '';
  loading = true;
  error = '';

  orderStatuses = [
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
  ];

  dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
      }
    });
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = 
        order.userName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.id?.toString().includes(this.searchQuery);
      
      const matchesStatus = !this.selectedStatus || order.status === this.selectedStatus;
      
      const matchesDate = this.checkDateRange(order.orderDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  checkDateRange(orderDate: string): boolean {
    if (this.selectedDateRange === 'all') return true;

    const orderDateTime = new Date(orderDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this.selectedDateRange) {
      case 'today':
        return orderDateTime >= today;
      
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDateTime >= weekAgo;
      
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return orderDateTime >= monthAgo;
      
      case 'custom':
        if (!this.startDate || !this.endDate) return true;
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        end.setHours(23, 59, 59, 999);
        return orderDateTime >= start && orderDateTime <= end;
      
      default:
        return true;
    }
  }

  updateOrderStatus(order: Order, status: string) {
    this.orderService.updateOrderStatus(order.id!, status).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.filterOrders();
        }
      },
      error: (error) => {
        this.error = 'Failed to update order status. Please try again.';
      }
    });
  }

  onSearch() {
    this.filterOrders();
  }

  onStatusChange() {
    this.filterOrders();
  }

  onDateRangeChange() {
    if (this.selectedDateRange !== 'custom') {
      this.startDate = '';
      this.endDate = '';
    }
    this.filterOrders();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'PROCESSING': return 'status-processing';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
