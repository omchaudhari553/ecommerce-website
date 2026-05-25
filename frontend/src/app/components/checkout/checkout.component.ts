import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-container">
      <h2>Checkout</h2>
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div *ngFor="let item of cartItems" class="order-item">
          <span>{{item.name}} x {{item.quantity}}</span>
          <span>{{formatCurrency(item.price * item.quantity)}}</span>
        </div>
        <div class="total">
          <strong>Total:</strong>
          <strong>{{formatCurrency(totalPrice)}}</strong>
        </div>
      </div>
      
      <div class="shipping-form">
        <h3>Shipping Information</h3>
        <div class="form-group">
          <label for="address">Shipping Address</label>
          <textarea 
            id="address" 
            [(ngModel)]="shippingAddress" 
            required 
            class="form-control"
            rows="3">
          </textarea>
        </div>
      </div>

      <div class="checkout-actions">
        <button 
          (click)="proceedToPayment()" 
          [disabled]="!shippingAddress || processing"
          class="btn-primary">
          {{processing ? 'Processing...' : 'Proceed to Payment'}}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
    }
    .order-summary {
      margin-top: 2rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    .total {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px solid #ddd;
    }
    .shipping-form {
      margin-top: 2rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .checkout-actions {
      margin-top: 2rem;
      text-align: right;
    }
    .btn-primary {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  shippingAddress: string = '';
  processing: boolean = false;
  userEmail: string | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.userEmail = this.authService.currentUser?.email || null;
    
    if (!this.userEmail) {
      console.error('No user email found');
      this.router.navigate(['/auth/login']);
      return;
    }
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (items: CartItem[]) => {
        this.cartItems = items;
        this.calculateTotal();
      },
      error: (error: Error) => {
        console.error('Error loading cart:', error);
      }
    });
  }

  proceedToPayment(): void {
    if (!this.userEmail) {
      console.error('No user email found');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.shippingAddress) {
      console.error('Shipping address is required');
      return;
    }

    this.processing = true;
    
    // Convert cart items to order items - use productId (not cart item id)
    const orderItems = this.cartItems.map(item => ({
      productId: item.productId || item.id,  // Use productId if available, fallback to id
      quantity: item.quantity
    }));
    
    console.log('Creating order with items:', orderItems);

    this.paymentService.createOrder(orderItems, this.shippingAddress, this.userEmail)
      .subscribe({
        next: (order) => {
          // Proceed with payment creation
          this.paymentService.createPaymentOrder(order)
            .subscribe({
              next: (response) => {
                // Handle successful payment creation
                this.processing = false;
                // Initialize Razorpay payment here
              },
              error: (error) => {
                console.error('Payment creation error:', error);
                this.processing = false;
              }
            });
        },
        error: (error) => {
          console.error('Order creation error:', error);
          this.processing = false;
        }
      });
  }

  private calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0);
  }

  formatCurrency(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  }
}
