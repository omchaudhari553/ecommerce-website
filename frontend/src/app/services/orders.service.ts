import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get all orders for the current user
  getUserOrders(): Observable<Order[]> {
    const userEmail = this.authService.currentUser?.email;
    if (!userEmail) {
      console.error('No user email found');
      return of([]);
    }
    
    console.log('Fetching orders for user:', userEmail);
    return this.http.get<Order[]>(`${this.apiUrl}/user/${encodeURIComponent(userEmail)}`)
      .pipe(
        map(backendOrders => {
          console.log('Raw backend orders:', backendOrders);
          // Transform backend orders to frontend format
          return backendOrders.map(order => this.transformBackendOrder(order));
        }),
        catchError((error: any) => {
          console.error('Error loading orders from backend:', error);
          // Return mock data as fallback
          return this.getMockOrders();
        })
      );
  }

  private transformBackendOrder(backendOrder: any): Order {
    console.log('=== TRANSFORMING BACKEND ORDER ===');
    console.log('Full backend order:', JSON.stringify(backendOrder, null, 2));
    
    const transformedOrder = {
      id: backendOrder.id.toString(),
      userId: backendOrder.user?.id?.toString() || 'unknown',
      date: new Date(backendOrder.orderDate || backendOrder.createdAt),
      status: backendOrder.status?.toLowerCase() as Order['status'] || 'processing',
      total: backendOrder.totalAmount || 0,
      items: backendOrder.orderItems?.map((item: any, index: number) => {
        console.log(`=== PROCESSING ITEM ${index} ===`);
        console.log('Raw item:', JSON.stringify(item, null, 2));
        
        const product = item.product || {};
        const itemPrice = Number(item.price) || Number(product.price) || 0;
        
        console.log('Product data:', JSON.stringify(product, null, 2));
        console.log('Final price used:', itemPrice);
        
        // Handle image URL - support both external URLs and local assets
        let imageUrl = product.imageUrl || product.image || 'assets/img/products/f1.jpg';
        // If it's not an external URL (http/https), prepend the local assets path
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `assets/img/products/${imageUrl}`;
        }
        
        const transformedItem = {
          productId: product.id?.toString() || item.id?.toString() || 'unknown',
          name: product.name || 'Unknown Product',
          quantity: item.quantity || 1,
          price: itemPrice,
          image: imageUrl
        };
        
        console.log('Transformed item:', transformedItem);
        return transformedItem;
      }) || [],
      shippingAddress: {
        street: backendOrder.shippingAddress || backendOrder.address || 'Address provided',
        city: backendOrder.city || 'City',
        state: backendOrder.state || 'State', 
        zipCode: backendOrder.zipCode || backendOrder.pincode || '000000'
      },
      paymentMethod: backendOrder.paymentMethod || 'Razorpay'
    };
    
    console.log('=== FINAL TRANSFORMED ORDER ===');
    console.log(JSON.stringify(transformedOrder, null, 2));
    
    return transformedOrder;
  }

  private getMockOrders(): Observable<Order[]> {
    // Return empty array - no more mock orders
    return of([]);
  }

  // Test order creation
  testOrderCreation(): Observable<any> {
    console.log('Testing order creation');
    return this.http.post<any>(`${this.apiUrl}/test-create`, {});
  }

  // Test database - get all orders
  testDatabase(): Observable<any> {
    console.log('Testing database - getting all orders');
    return this.http.get<any>(`${this.apiUrl}/test-all`);
  }

  // Debug order by ID
  debugOrder(orderId: string): Observable<any> {
    console.log('Debugging order:', orderId);
    return this.http.get<any>(`${this.apiUrl}/debug/${orderId}`);
  }

  // Clear all orders (for testing)
  clearOrders(): Observable<any> {
    console.log('Clearing all orders...');
    return this.http.delete(`${this.apiUrl}/clear`);
  }

  // Get a specific order by ID
  getOrderById(orderId: string): Observable<Order> {
    // For development, find in mock data
    const mockOrders = this.getUserOrders();
    return new Observable(subscriber => {
      mockOrders.subscribe(orders => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          subscriber.next(order);
        } else {
          subscriber.error('Order not found');
        }
        subscriber.complete();
      });
    });

    // TODO: For production, uncomment this
    // return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  // Create a new order
  createOrder(order: Omit<Order, 'id' | 'date'>): Observable<Order> {
    const newOrder: Order = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date()
    };
    return of(newOrder);

    // TODO: For production, uncomment this
    // return this.http.post<Order>(this.apiUrl, order);
  }

  // Update order status
  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> {
    return this.getOrderById(orderId).pipe(
      map(order => ({
        ...order,
        status
      }))
    );

    // TODO: For production, uncomment this
    // return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status`, { status });
  }
} 