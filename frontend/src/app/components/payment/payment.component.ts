import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { PaymentService, CreateOrderRequest, Order } from '../../services/payment.service';
import { CartItem } from '../../models/cart-item.model';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payment-container">
      <div class="order-summary">
        <div class="summary-header">
          <h2>Order Summary</h2>
          <div class="secure-badge">
            <i class="fas fa-lock"></i> Secure Checkout
          </div>
        </div>

        <div class="customer-details">
          <h3>Contact Information</h3>
          <div class="form-group">
            <label for="customerName">Full Name</label>
            <input 
              type="text" 
              id="customerName"
              [(ngModel)]="customerName"
              placeholder="Enter your full name"
              class="form-input"
              [class.error]="!customerName && errorMessage"
            >
          </div>
          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input 
              type="tel" 
              id="phoneNumber"
              [(ngModel)]="phoneNumber"
              placeholder="Enter your phone number"
              class="form-input"
              [class.error]="!phoneNumber && errorMessage"
              pattern="[0-9]{10}"
            >
          </div>
        </div>

        <div class="items-container">
          <div *ngFor="let item of cartItems" class="item">
            <div class="item-details">
              <img [src]="'assets/img/products/' + item.image" [alt]="item.name" class="item-image">
              <div class="item-info">
                <h4>{{item.name}}</h4>
                <p class="quantity">Quantity: {{item.quantity}}</p>
              </div>
            </div>
            <div class="item-price">
              {{formatCurrency(item.price * item.quantity)}}
            </div>
          </div>
        </div>

        <div class="price-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{formatCurrency(totalAmount)}}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div class="summary-row total">
            <strong>Total Amount</strong>
            <strong>{{formatCurrency(totalAmount)}}</strong>
          </div>
        </div>

        <div class="shipping-section" *ngIf="!processing">
          <h3>Shipping Address</h3>
          <textarea 
            [(ngModel)]="shippingAddress" 
            placeholder="Enter your complete shipping address"
            rows="3"
            class="address-input"
          ></textarea>
        </div>

        <button 
          (click)="initiatePayment()" 
          [disabled]="processing || !shippingAddress || !customerName || !phoneNumber"
          class="pay-button"
        >
          <i class="fas fa-lock"></i>
          {{processing ? 'Processing...' : 'Proceed to Pay'}}
        </button>

        <!-- Manual Stop Processing Button -->
        <button 
          *ngIf="processing"
          (click)="stopProcessing()" 
          class="stop-processing-button"
        >
          Stop Processing
        </button>

        <div class="payment-info">
          <div class="secure-payment">
            <i class="fas fa-shield-alt"></i>
            <span>Secure Payment by Razorpay</span>
          </div>
          <div class="accepted-payments">
            <img src="assets/img/payments/visa.png" alt="Visa">
            <img src="assets/img/payments/mastercard.png" alt="Mastercard">
            <img src="assets/img/payments/rupay.png" alt="RuPay">
          </div>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{errorMessage}}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-container {
      max-width: 800px;
      margin: 3rem auto;
      padding: 0 1rem;
    }

    .order-summary {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f0f0f0;
    }

    .summary-header h2 {
      font-size: 1.8rem;
      color: #2c3e50;
      margin: 0;
    }

    .secure-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #088178;
      font-size: 0.9rem;
    }

    .items-container {
      margin: 2rem 0;
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      margin-bottom: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      transition: transform 0.2s;
    }

    .item:hover {
      transform: translateX(5px);
    }

    .item-details {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .item-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 6px;
    }

    .item-info h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .quantity {
      color: #666;
      margin: 0;
    }

    .item-price {
      font-weight: 600;
      color: #088178;
    }

    .price-summary {
      margin: 2rem 0;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      color: #666;
    }

    .summary-row.total {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px solid #e9ecef;
      color: #2c3e50;
      font-size: 1.2rem;
    }

    .shipping-section {
      margin: 2rem 0;
    }

    .shipping-section h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .address-input {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      resize: vertical;
      transition: border-color 0.3s;
    }

    .address-input:focus {
      border-color: #088178;
      outline: none;
    }

    .pay-button {
      width: 100%;
      padding: 1.2rem;
      background: #088178;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .pay-button:hover {
      background: #066c65;
      transform: translateY(-2px);
    }

    .pay-button:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .stop-processing-button {
      width: 100%;
      padding: 1rem;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .stop-processing-button:hover {
      background: #c82333;
      transform: translateY(-2px);
    }

    .payment-info {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
      text-align: center;
    }

    .secure-payment {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .accepted-payments {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .accepted-payments img {
      height: 30px;
      object-fit: contain;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #dc3545;
      margin-top: 1rem;
      padding: 1rem;
      border: 1px solid #dc3545;
      border-radius: 8px;
      background: #fff;
    }

    .customer-details {
      margin: 2rem 0;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .customer-details h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
    }

    .form-group {
      margin-bottom: 1.2rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    .form-input {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .form-input:focus {
      border-color: #088178;
      outline: none;
      box-shadow: 0 0 0 2px rgba(8, 129, 120, 0.1);
    }

    .form-input.error {
      border-color: #dc3545;
    }

    .form-input::placeholder {
      color: #adb5bd;
    }

    @media (max-width: 600px) {
      .payment-container {
        margin: 1rem auto;
      }

      .order-summary {
        padding: 1.5rem;
      }

      .item-image {
        width: 50px;
        height: 50px;
      }

      .summary-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .customer-details {
        padding: 1rem;
      }
    }
  `]
})
export class PaymentComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  processing: boolean = false;
  errorMessage: string | null = null;
  shippingAddress: string = '';
  customerName: string = '';
  phoneNumber: string = '';
  currentOrder: Order | null = null;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if this is payment for an existing order
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['orderId'] && params['amount']) {
        console.log('Payment for existing order:', params);
        this.initiatePaymentForExistingOrder(params['orderId'], params['amount']);
      } else {
        this.loadCartItems();
      }
    });
  }

  private syncCartWithProducts(items: CartItem[], products: Product[]): CartItem[] {
    const synced: CartItem[] = [];
    for (const item of items) {
      const pid = item.productId ?? item.id;
      let product = products.find(p => p.id === pid);
      if (!product && item.name) {
        product = products.find(p => p.name === item.name);
      }
      if (!product) {
        continue;
      }
      synced.push({
        ...item,
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image || item.image || 'f1.jpg'
      });
    }
    return synced;
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (items: CartItem[]) => {
        this.productService.getProducts().subscribe({
          next: (products) => {
            this.cartItems = this.syncCartWithProducts(items, products);

            if (items.length > 0 && this.cartItems.length === 0) {
              this.errorMessage = 'Your cart has outdated items. Please shop again and add products.';
              this.cartService.clearCart();
            }
            this.calculateTotal();
          },
          error: () => {
            this.cartItems = items;
            this.calculateTotal();
          }
        });
      },
      error: (error: Error) => {
        this.errorMessage = 'Error loading cart items';
        console.error('Error loading cart:', error);
      }
    });
  }

  private calculateTotal(): void {
    // Calculate total without any rounding or conversion
    this.totalAmount = this.cartItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      console.log(`Item: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity}, Total: ${itemTotal}`);
      return total + itemTotal;
    }, 0);
    
    // Ensure totalAmount is a number with 2 decimal places
    this.totalAmount = Number(this.totalAmount.toFixed(2));
    console.log('Final total amount:', this.totalAmount);
  }

  private initiatePaymentForExistingOrder(orderId: string, amount: string): void {
    console.log('Initiating payment for existing order:', orderId, amount);
    
    // Set the total amount from the order
    this.totalAmount = Number(amount);
    
    // Create a mock order object for payment
    const existingOrder: Order = {
      id: Number(orderId),
      orderItems: [],
      totalAmount: this.totalAmount,
      status: 'PENDING',
      shippingAddress: 'Order from My Orders',
      paymentMethod: 'Razorpay'
    };
    
    // Directly create payment order without creating a new order
    this.createPaymentOrder(existingOrder);
  }

  formatCurrency(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log('Checking if Razorpay script exists...');
      if (window.hasOwnProperty('Razorpay')) {
        console.log('Razorpay already loaded');
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        this.errorMessage = 'Failed to load payment system. Please try again.';
        resolve(false);
      };

      document.body.appendChild(script);
    });
  }

  async initiatePayment(): Promise<void> {
    if (!this.customerName.trim()) {
      this.errorMessage = 'Please enter your full name';
      return;
    }

    if (!this.phoneNumber.trim() || !/^[0-9]{10}$/.test(this.phoneNumber)) {
      this.errorMessage = 'Please enter a valid 10-digit phone number';
      return;
    }

    if (!this.shippingAddress.trim()) {
      this.errorMessage = 'Please enter your shipping address';
      return;
    }

    if (!this.authService.currentUser?.email) {
      this.errorMessage = 'Please log in to continue';
      return;
    }

    this.processing = true;
    this.errorMessage = null;

    // Ensure Razorpay is loaded
    const razorpayLoaded = await this.loadRazorpayScript();
    if (!razorpayLoaded) {
      this.processing = false;
      return;
    }

    console.log('Starting payment process...');
    console.log('Cart items:', this.cartItems);
    console.log('Total amount:', this.totalAmount);

    if (this.cartItems.length === 0) {
      this.processing = false;
      this.errorMessage = 'Your cart is empty. Add products before checkout.';
      return;
    }

    let orderItems: { productId: number; quantity: number }[];
    try {
      orderItems = this.cartItems.map(item => {
        const productId = item.productId ?? item.id;
        if (!productId) {
          throw new Error('Invalid cart item: missing product id');
        }
        return { productId, quantity: item.quantity };
      });
    } catch {
      this.processing = false;
      this.errorMessage = 'Invalid cart. Please clear your cart and add products again.';
      return;
    }

    console.log('Creating order with items:', orderItems);

    this.paymentService.createOrder(
      orderItems,
      this.shippingAddress,
      this.authService.currentUser.email
    ).subscribe({
      next: (order: Order) => {
        console.log('Order created successfully:', order);
        this.createPaymentOrder(order);
      },
      error: (error) => {
        console.error('Full error object:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        this.processing = false;
        this.errorMessage = error.error?.message || error.error?.error || 'Failed to create order. Please try again.';
      }
    });
  }

  private createPaymentOrder(order: Order): void {
    console.log('Creating payment order for order:', order);
    console.log('Total amount before payment:', this.totalAmount);
    
    // Store current order and ensure we're sending the correct total amount
    this.currentOrder = order;
    order.totalAmount = this.totalAmount;
    
    this.paymentService.createPaymentOrder(order).subscribe({
      next: (response) => {
        console.log('Payment order created successfully:', response);
        this.openRazorpayCheckout(response);
      },
      error: (error) => {
        console.error('Full payment error:', error);
        console.error('Payment error status:', error.status);
        console.error('Payment error message:', error.message);
        console.error('Payment error details:', error.error);
        this.processing = false;
        this.errorMessage = error.error?.message || error.error?.error || 'Failed to initiate payment. Please try again.';
      }
    });
  }

  private openRazorpayCheckout(order: any): void {
    console.log('Opening Razorpay checkout with order:', order);
    
    // Parse the amount from the order response (which is in paise)
    const amountInPaise = parseInt(order.amount);
    const amountInRupees = amountInPaise / 100;
    
    console.log('Amount debug:', {
      cartTotal: this.totalAmount,
      orderAmount: order.amount,
      amountInPaise: amountInPaise,
      amountInRupees: amountInRupees
    });

    const options = {
      key: order.key,
      amount: amountInPaise, // Amount in paise
      currency: order.currency || 'INR',
      name: 'Cara',
      description: `Order Total: ₹${amountInRupees}`,
      order_id: order.razorpayOrderId,
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true
      },
      config: {
        display: {
          blocks: {
            upi: {
              name: 'Pay via UPI / UPI ID',
              instruments: [{ method: 'upi' }]
            }
          },
          sequence: ['block.upi'],
          preferences: {
            show_default_blocks: true
          }
        }
      },
      upi: {
        flow: 'collect'
      },
      handler: (response: any) => {
        console.log('Payment success response:', response);
        // Stop processing immediately
        this.processing = false;
        console.log('Processing stopped in handler');
        
        // Add delay to ensure processing is stopped
        setTimeout(() => {
          const appOrderId = this.currentOrder?.id;
          if (!appOrderId) {
            this.errorMessage = 'Order reference lost. Please contact support.';
            return;
          }
          this.verifyPayment({
            orderId: String(appOrderId),
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          });
        }, 100);
      },
      prefill: {
        name: this.customerName,
        email: this.authService.currentUser?.email || '',
        contact: this.phoneNumber
      },
      theme: {
        color: '#088178'
      },
      modal: {
        ondismiss: () => {
          console.log('Checkout modal closed');
          this.processing = false;
          console.log('Processing stopped on modal dismiss');
        },
        escape: false,
        handleback: false
      },
      retry: {
        enabled: false
      },
      timeout: 300
    };

    console.log('Razorpay options:', options);
    
    const rzp = new (window as any).Razorpay(options);
    
    // Add event handlers
    rzp.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response);
      this.processing = false;
      this.errorMessage = 'Payment failed. Please try again.';
    });
    
    // Add timeout fallback
    setTimeout(() => {
      if (this.processing) {
        console.log('Payment timeout - stopping processing');
        this.processing = false;
        this.errorMessage = 'Payment timed out. Please check your order status or click "Stop Processing".';
      }
    }, 30000); // 30 second timeout
    
    // Add window click handler to stop processing
    const stopProcessingHandler = () => {
      if (this.processing) {
        console.log('Manual stop processing triggered');
        this.processing = false;
        this.errorMessage = 'Processing stopped manually. Please check your order status.';
        window.removeEventListener('click', stopProcessingHandler);
      }
    };
    
    // Add click listener after 5 seconds
    setTimeout(() => {
      if (this.processing) {
        window.addEventListener('click', stopProcessingHandler);
      }
    }, 5000);
    
    rzp.open();
  }

  private verifyPayment(verification: any): void {
    console.log('=== PAYMENT VERIFICATION START ===');
    console.log('Verifying payment:', verification);
    console.log('Current cart items:', JSON.stringify(this.cartItems, null, 2));
    console.log('Current order:', JSON.stringify(this.currentOrder, null, 2));
    
    this.paymentService.verifyPayment(verification).subscribe({
      next: (response) => {
        console.log('Payment verification response:', response);
        // Response is now a boolean directly
        if (response) {
          console.log('=== PAYMENT SUCCESS - PROCESSING ORDER ===');
          // Store cart items before clearing
          const orderItemsForBill = [...this.cartItems];
          console.log('Order items for bill:', JSON.stringify(orderItemsForBill, null, 2));
          
          // Save order data to localStorage as backup
          const orderData = {
            order: this.currentOrder,
            orderItems: orderItemsForBill,
            totalAmount: this.totalAmount,
            customerName: this.customerName,
            shippingAddress: this.shippingAddress
          };
          console.log('Order data being saved to localStorage:', JSON.stringify(orderData, null, 2));
          localStorage.setItem('lastOrderData', JSON.stringify(orderData));
          
          this.cartService.clearCart();
          
          // Stop processing
          this.processing = false;
          
          // Pass order data to confirmation page
          console.log('Navigating to order confirmation with data:', orderData);
          this.router.navigate(['/order-confirmation'], { 
            state: { 
              order: this.currentOrder,
              orderItems: orderItemsForBill,
              totalAmount: this.totalAmount,
              customerName: this.customerName,
              shippingAddress: this.shippingAddress
            } 
          });
        } else {
          this.processing = false;
          this.errorMessage = 'Payment verification failed';
        }
      },
      error: (error) => {
        console.error('Payment verification error:', error);
        this.processing = false;
        this.errorMessage = 'Payment verification failed';
      }
    });
  }

  stopProcessing(): void {
    console.log('Manual stop processing called');
    this.processing = false;
    this.errorMessage = 'Processing stopped manually. Please check your order status or try again.';
  }
}
