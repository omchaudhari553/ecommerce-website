import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    // Load cart items from localStorage on service initialization
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(i => i.id === item.id);

    // Ensure image path is correct
    const itemWithImage = {
      ...item,
      image: item.image || `f${item.id}.jpg`  // Use default product image naming pattern
    };

    if (existingItem) {
      const updatedItems = currentItems.map(i =>
        i.id === item.id ? { ...itemWithImage, quantity: i.quantity + 1 } : i
      );
      this.cartItemsSubject.next(updatedItems);
    } else {
      this.cartItemsSubject.next([...currentItems, { ...itemWithImage, quantity: 1 }]);
    }
    this.saveToLocalStorage();
  }

  removeFromCart(id: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.id !== id);
    this.cartItemsSubject.next(updatedItems);
    this.saveToLocalStorage();
  }

  updateCartItemQuantity(id: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    this.cartItemsSubject.next(updatedItems);
    this.saveToLocalStorage();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItemsSubject.value));
  }

  getTotalItems(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems$.subscribe(items => {
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        observer.next(total);
      });
    });
  }

  getTotalPrice(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems$.subscribe(items => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        observer.next(total);
      });
    });
  }
}
