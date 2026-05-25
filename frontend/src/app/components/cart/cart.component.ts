import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  loading: boolean = true;
  error: string | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (items: CartItem[]) => {
        this.cartItems = items;
        this.calculateTotal();
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Failed to load cart items';
        this.loading = false;
        console.error('Error loading cart:', error);
      }
    });
  }

  removeItem(item: CartItem): void {
    if (item.id !== undefined) {
      this.cartService.removeFromCart(item.id);
      this.loadCartItems();
    }
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (item.id !== undefined) {
      this.cartService.updateCartItemQuantity(item.id, newQuantity);
      this.loadCartItems();
    }
  }

  incrementQuantity(item: CartItem): void {
    if (item.id !== undefined) {
      this.cartService.updateCartItemQuantity(item.id, item.quantity + 1);
      this.loadCartItems();
    }
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1 && item.id !== undefined) {
      this.cartService.updateCartItemQuantity(item.id, item.quantity - 1);
      this.loadCartItems();
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCartItems();
  }

  private calculateTotal(): void {
    // Calculate total without any rounding
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    console.log('Cart total calculated:', this.totalPrice);
  }

  formatCurrency(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getImagePath(item: CartItem): string {
    if (!item) return '/assets/img/products/f1.jpg';
    
    // If we have a full URL, use it
    if (item.imageUrl?.startsWith('http')) {
      return item.imageUrl;
    }
    
    // If we have an image property, construct the path
    if (item.image) {
      return `/assets/img/products/${item.image}`;
    }
    
    // Use default image based on product ID
    return `/assets/img/products/f${item.id}.jpg`;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '/assets/img/products/f1.jpg';
    }
  }
}
