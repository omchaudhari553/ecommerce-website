import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id?: number;
  userId: number;
  userName: string;
  orderItems: OrderItem[];
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService extends ApiService {
  private endpoint = '/orders';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  private handleError(error: any): Observable<never> {
    console.error('Error occurred:', error);
    return throwError(() => error);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}${this.endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}${this.endpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}${this.endpoint}`, order, { headers: super.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(
      `${environment.apiUrl}${this.endpoint}/${id}/status`, 
      { status }, 
      { headers: super.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  updatePaymentStatus(id: number, paymentStatus: string): Observable<Order> {
    return this.http.patch<Order>(
      `${environment.apiUrl}${this.endpoint}/${id}/payment`, 
      { paymentStatus }, 
      { headers: super.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getOrdersByUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}${this.endpoint}/user/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}${this.endpoint}/status/${status}`).pipe(
      catchError(this.handleError)
    );
  }

  getOrdersByDateRange(startDate: string, endDate: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}${this.endpoint}/date-range`, {
      params: { startDate, endDate }
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${this.endpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getUserOrders(email: string): Observable<Order[]> {
    console.log('Fetching orders for user:', email);
    const url = `${environment.apiUrl}${this.endpoint}/user/email/${email}`;
    console.log('Request URL:', url);
    
    return this.http.get<Order[]>(url, { headers: super.getHeaders() })
      .pipe(
        tap(orders => {
          console.log('Received orders:', orders);
          if (!orders || orders.length === 0) {
            console.log('No orders found for user');
          }
        }),
        catchError(this.handleError)
      );
  }

  getOrderDetails(orderId: number): Observable<Order> {
    console.log('Fetching order details for id:', orderId);
    const url = `${environment.apiUrl}${this.endpoint}/${orderId}/details`;
    console.log('Request URL:', url);
    
    return this.http.get<Order>(url, { headers: super.getHeaders() })
      .pipe(
        tap(order => {
          console.log('Received order details:', order);
          if (!order) {
            console.log('Order details not found');
          }
        }),
        catchError(this.handleError)
      );
  }

  generateBill(orderId: number): Observable<Blob> {
    console.log('Generating bill for order id:', orderId);
    const url = `${environment.apiUrl}${this.endpoint}/${orderId}/bill`;
    console.log('Request URL:', url);
    
    return this.http.get(url, {
      responseType: 'blob',
      headers: super.getHeaders()
    })
      .pipe(
        tap(bill => {
          console.log('Bill generated:', bill);
        }),
        catchError(this.handleError)
      );
  }
}
