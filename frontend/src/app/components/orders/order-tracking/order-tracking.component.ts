import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrdersService, Order } from '../../../services/orders.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="tracking-container">
      <h1>Track Order</h1>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading order details...</p>
      </div>

      <!-- Error State -->
      <div class="error-state" *ngIf="error">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{error}}</p>
        <button (click)="loadOrder()" class="retry-btn">Try Again</button>
        <a routerLink="/orders" class="back-btn">Back to Orders</a>
      </div>

      <!-- Order Details -->
      <div class="order-tracking" *ngIf="!loading && !error && order">
        <div class="order-info">
          <h2>Order #{{order.id}}</h2>
          <p class="order-date">Ordered on {{formatDate(order.date)}}</p>
          <div class="order-status" [ngClass]="getStatusClass(order.status)">
            {{order.status | titlecase}}
          </div>
        </div>

        <div class="tracking-timeline">
          <div class="timeline-item" [class.active]="isStatusActive('pending')">
            <div class="timeline-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="timeline-content">
              <h3>Order Placed</h3>
              <p>Your order has been placed successfully</p>
            </div>
          </div>

          <div class="timeline-item" [class.active]="isStatusActive('processing')">
            <div class="timeline-icon">
              <i class="fas fa-cog"></i>
            </div>
            <div class="timeline-content">
              <h3>Processing</h3>
              <p>Your order is being processed</p>
            </div>
          </div>

          <div class="timeline-item" [class.active]="isStatusActive('shipped')">
            <div class="timeline-icon">
              <i class="fas fa-truck"></i>
            </div>
            <div class="timeline-content">
              <h3>Shipped</h3>
              <p>Your order is on the way</p>
            </div>
          </div>

          <div class="timeline-item" [class.active]="isStatusActive('delivered')">
            <div class="timeline-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="timeline-content">
              <h3>Delivered</h3>
              <p>Your order has been delivered</p>
            </div>
          </div>
        </div>

        <div class="order-summary">
          <h3>Order Summary</h3>
          <div class="items-list">
            <div class="item" *ngFor="let item of order.items">
              <img [src]="item.image" [alt]="item.name">
              <div class="item-details">
                <h4>{{item.name}}</h4>
                <p class="quantity">Quantity: {{item.quantity}}</p>
                <p class="price">{{formatPrice(item.price)}}</p>
              </div>
            </div>
          </div>

          <div class="delivery-details">
            <div class="shipping-info">
              <h4>Shipping Address</h4>
              <p>{{order.shippingAddress.street}}</p>
              <p>{{order.shippingAddress.city}}, {{order.shippingAddress.state}}</p>
              <p>{{order.shippingAddress.zipCode}}</p>
            </div>
            <div class="total-info">
              <h4>Order Total</h4>
              <p class="total-amount">{{formatPrice(order.total)}}</p>
            </div>
          </div>
        </div>

        <div class="actions">
          <a routerLink="/orders" class="back-btn">Back to Orders</a>
          <button class="support-btn" (click)="contactSupport()">Contact Support</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    this.loading = true;
    this.error = null;
    
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.error = 'Order ID not found';
      this.loading = false;
      return;
    }

    this.ordersService.getOrderById(orderId)
      .pipe(
        catchError(error => {
          console.error('Error loading order:', error);
          this.error = 'Failed to load order details. Please try again later.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(order => {
        this.order = order;
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

  isStatusActive(status: string): boolean {
    if (!this.order) return false;
    
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(this.order.status);
    const statusIndex = statusOrder.indexOf(status);
    
    return statusIndex <= currentIndex;
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

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  }

  contactSupport(): void {
    // Implement contact support functionality
    window.location.href = `mailto:support@example.com?subject=Order%20${this.order?.id}%20Support`;
  }
} 