import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrdersService, Order } from '../../services/orders.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;

  constructor(private ordersService: OrdersService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    
    console.log('Starting to load orders...');
    
    this.ordersService.getUserOrders()
      .pipe(
        catchError((error: any) => {
          console.error('Error loading orders:', error);
          this.error = 'Failed to load orders. Please try again later.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
          console.log('Orders loading completed. Total orders:', this.orders.length);
        })
      )
      .subscribe(orders => {
        this.orders = orders;
        console.log('Loaded orders:', orders); // Debug log
        console.log('Orders details:', orders.map(o => ({
          id: o.id,
          status: o.status,
          total: o.total,
          itemCount: o.items?.length || 0,
          items: o.items?.map(i => ({ name: i.name, image: i.image }))
        })));
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  testOrderCreation(): void {
    this.ordersService.testOrderCreation().subscribe({
      next: (response: any) => {
        console.log('=== ORDER CREATION TEST RESULTS ===');
        console.log('Test response:', response);
        if (response.success) {
          alert(`Test order created successfully! Order ID: ${response.orderId}, Product: ${response.productName}`);
        } else {
          alert(`Test order creation failed: ${response.error}`);
        }
        // Reload orders to see the new test order
        this.loadOrders();
      },
      error: (error: any) => {
        console.error('Error testing order creation:', error);
        alert('Failed to test order creation. Check console for errors.');
      }
    });
  }

  testDatabase(): void {
    this.ordersService.testDatabase().subscribe({
      next: (data: any) => {
        console.log('=== DATABASE TEST RESULTS ===');
        console.log('All orders in database:', data);
        alert('Database test results logged to console. Check F12 > Console.');
      },
      error: (error: any) => {
        console.error('Error testing database:', error);
        alert('Failed to test database. Check console for errors.');
      }
    });
  }

  debugOrder(orderId: string): void {
    this.ordersService.debugOrder(orderId).subscribe({
      next: (debugData: any) => {
        console.log('Debug order data:', debugData);
        alert('Debug data logged to console. Check F12 > Console for details.');
      },
      error: (error: any) => {
        console.error('Error debugging order:', error);
        alert('Failed to debug order. Check console for errors.');
      }
    });
  }

  clearOrders(): void {
    if (confirm('Are you sure you want to clear all orders? This action cannot be undone.')) {
      // Clear local orders immediately
      this.orders = [];
      
      // Then try to clear from backend
      this.ordersService.clearOrders().subscribe({
        next: (response) => {
          console.log('Orders cleared from backend:', response);
          alert('All orders have been cleared from database!');
        },
        error: (error) => {
          console.error('Error clearing orders from backend:', error);
          alert('Orders cleared from local display. Backend may not be available.');
        }
      });
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  }

  payForOrder(order: Order): void {
    console.log('Initiating payment for order:', order);
    
    // Navigate to payment page with order data
    this.router.navigate(['/payment'], {
      queryParams: {
        orderId: order.id,
        amount: order.total
      }
    });
  }
} 