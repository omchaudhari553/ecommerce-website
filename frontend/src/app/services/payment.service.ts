import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  orderItems: OrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus?: string;
}

export interface CreateOrderRequest {
  orderItems: OrderItem[];
  shippingAddress: string;
  userEmail: string;
}

export interface PaymentOrderRequest {
  orderId: number;
  amount: string; 
  currency: string;
  receipt: string;
}

export interface PaymentResponse {
  razorpayOrderId: string;
  amount: string;
  key: string;
  currency: string;
  description: string;
}

export interface PaymentVerificationRequest {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends ApiService {
  private endpoint = '/payment';
  private orderEndpoint = '/orders';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  createOrder(items: OrderItem[], shippingAddress: string, userEmail: string): Observable<Order> {
    console.log('=== CREATING ORDER ===');
    console.log('Items:', JSON.stringify(items, null, 2));
    console.log('Shipping Address:', shippingAddress);
    console.log('User Email:', userEmail);
    
    const orderRequest: CreateOrderRequest = {
      orderItems: items,
      shippingAddress: shippingAddress,
      userEmail: userEmail
    };
    
    console.log('Order Request:', JSON.stringify(orderRequest, null, 2));
    console.log('API URL:', `${this.baseUrl}${this.orderEndpoint}`);
    
    return this.http.post<Order>(`${this.baseUrl}${this.orderEndpoint}`, orderRequest, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          console.log('Order created successfully:', response);
        }),
        catchError((error: any) => {
          console.error('=== ORDER CREATION FAILED ===');
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error details:', error.error);
          console.error('Full error:', error);
          throw error;
        })
      );
  }

  createPaymentOrder(order: Order): Observable<PaymentResponse> {
    // Ensure amount is properly formatted with 2 decimal places
    const amount = Number(order.totalAmount).toFixed(2);
    
    const paymentRequest: PaymentOrderRequest = {
      orderId: order.id,
      amount: amount, // Send exact amount in rupees
      currency: 'INR',
      receipt: `RCPT-${order.id}`
    };
    
    console.log('Creating payment request:', {
      orderId: paymentRequest.orderId,
      amount: paymentRequest.amount,
      amountInRupees: amount,
      amountInPaise: Number(amount) * 100,
      currency: paymentRequest.currency,
      receipt: paymentRequest.receipt
    });
    
    return this.http.post<PaymentResponse>(
      `${this.baseUrl}${this.endpoint}/create`,
      paymentRequest,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        console.log('Payment response:', {
          orderId: response.razorpayOrderId,
          amount: response.amount,
          amountInPaise: Number(response.amount),
          amountInRupees: Number(response.amount) / 100,
          currency: response.currency
        });
      }),
      catchError(error => {
        console.error('Payment creation error:', error);
        console.error('Error details:', error.error);
        throw error;
      })
    );
  }

  verifyPayment(verification: PaymentVerificationRequest): Observable<boolean> {
    // Use debug endpoint temporarily for testing
    return this.http.post<any>(`${this.baseUrl}${this.endpoint}/verify-debug`, verification, { headers: this.getHeaders() })
      .pipe(
        map((response: any) => response && response.success === true),
        tap(response => {
          console.log('Payment verification response:', response);
        })
      );
  }
}
