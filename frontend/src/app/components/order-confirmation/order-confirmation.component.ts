import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';
import { Order } from '../../services/payment.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="confirmation-container">
      <div class="confirmation-card">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h1>Order Placed!</h1>
        <p>Thank you for your purchase. Your order has been successfully placed.</p>
        
        <!-- Order Bill Section -->
        <div class="order-bill">
          <h3>Order Bill</h3>
          
          <!-- Debug Info -->
          <div style="background: #f0f0f0; padding: 10px; margin-bottom: 15px; border-radius: 5px;">
            <small>Debug: Order ID: {{order?.id || 'N/A'}}, Items: {{orderItems.length || 0}}, Total: {{totalAmount || 0}}</small>
          </div>
          
          <div class="bill-details">
            <div class="bill-row" *ngIf="order">
              <span><strong>Order ID:</strong></span>
              <span>#{{order.id}}</span>
            </div>
            <div class="bill-row">
              <span><strong>Customer Name:</strong></span>
              <span>{{customerName || 'Customer'}}</span>
            </div>
            <div class="bill-row">
              <span><strong>Shipping Address:</strong></span>
              <span>{{shippingAddress || 'Address provided'}}</span>
            </div>
            <div class="bill-row">
              <span><strong>Order Date:</strong></span>
              <span>{{orderDate | date:'medium'}}</span>
            </div>
          </div>
          
          <div class="items-section" *ngIf="orderItems && orderItems.length > 0">
            <h4>Order Items</h4>
            <div class="bill-item" *ngFor="let item of orderItems">
              <div class="item-info">
                <img [src]="'assets/img/products/' + item.image" [alt]="item.name" class="item-image">
                <div class="item-details">
                  <span class="item-name">{{item.name}}</span>
                  <span class="item-quantity">Qty: {{item.quantity}}</span>
                </div>
              </div>
              <span class="item-price">{{formatCurrency(item.price * item.quantity)}}</span>
            </div>
          </div>
          
          <!-- Show placeholder if no items -->
          <div class="items-section" *ngIf="!orderItems || orderItems.length === 0">
            <h4>Order Items</h4>
            <p style="text-align: center; color: #666; padding: 20px;">Order details are being processed...</p>
          </div>
          
          <div class="bill-total">
            <div class="total-row">
              <span><strong>Total Amount:</strong></span>
              <span><strong>{{formatCurrency(totalAmount)}}</strong></span>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button routerLink="/orders" class="view-orders">
            View Order History
          </button>
          <button routerLink="/shop" class="continue-shopping">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 2rem;
    }

    .confirmation-card {
      background: white;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 500px;
    }

    .success-icon {
      color: #28a745;
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    h1 {
      color: #333;
      margin-bottom: 1rem;
    }

    p {
      color: #666;
      margin-bottom: 2rem;
    }

    .continue-shopping {
      background: #088178;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .continue-shopping:hover {
      background: #066c65;
    }

    .order-bill {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 2rem 0;
      text-align: left;
    }

    .order-bill h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
      text-align: center;
    }

    .bill-details {
      margin-bottom: 1.5rem;
    }

    .bill-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e9ecef;
    }

    .bill-row:last-child {
      border-bottom: none;
    }

    .items-section h4 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .bill-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }

    .item-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .item-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-details {
      display: flex;
      flex-direction: column;
    }

    .item-name {
      font-weight: 500;
      color: #2c3e50;
    }

    .item-quantity {
      font-size: 0.9rem;
      color: #666;
    }

    .item-price {
      font-weight: 600;
      color: #088178;
    }

    .bill-total {
      border-top: 2px solid #e9ecef;
      padding-top: 1rem;
      margin-top: 1rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 1.2rem;
      color: #2c3e50;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }

    .view-orders {
      background: #6c757d;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .view-orders:hover {
      background: #5a6268;
    }

    .continue-shopping {
      background: #088178;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .continue-shopping:hover {
      background: #066c65;
    }
  `]
})
export class OrderConfirmationComponent {
  order: Order | null = null;
  orderItems: CartItem[] = [];
  totalAmount: number = 0;
  customerName: string = '';
  shippingAddress: string = '';
  orderDate: Date = new Date();

  constructor(private router: Router) {
    // Get order data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const state = navigation.extras.state as any;
      this.order = state.order;
      this.orderItems = state.orderItems || [];
      this.totalAmount = state.totalAmount || 0;
      this.customerName = state.customerName || '';
      this.shippingAddress = state.shippingAddress || '';
      this.orderDate = new Date();
      
      console.log('Order confirmation data from navigation:', {
        order: this.order,
        orderItems: this.orderItems,
        totalAmount: this.totalAmount
      });
    } else {
      // Fallback to localStorage
      try {
        const storedData = localStorage.getItem('lastOrderData');
        if (storedData) {
          const data = JSON.parse(storedData);
          this.order = data.order;
          this.orderItems = data.orderItems || [];
          this.totalAmount = data.totalAmount || 0;
          this.customerName = data.customerName || '';
          this.shippingAddress = data.shippingAddress || '';
          this.orderDate = new Date();
          
          console.log('Order confirmation data from localStorage:', {
            order: this.order,
            orderItems: this.orderItems,
            totalAmount: this.totalAmount
          });
          
          // Clear localStorage after use
          localStorage.removeItem('lastOrderData');
        } else {
          // Final fallback - show sample data
          console.log('No order data found, showing sample data');
          this.order = { id: 999 } as any;
          this.orderItems = [];
          this.totalAmount = 0;
          this.customerName = 'Customer';
          this.shippingAddress = 'Address will be updated';
          this.orderDate = new Date();
        }
      } catch (error) {
        console.error('Error reading order data from localStorage:', error);
        // Show sample data on error
        this.order = { id: 999 } as any;
        this.orderItems = [];
        this.totalAmount = 0;
        this.customerName = 'Customer';
        this.shippingAddress = 'Address will be updated';
        this.orderDate = new Date();
      }
    }
  }

  formatCurrency(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
}
