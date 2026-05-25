import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  currentPage = 1;
  itemsPerPage = 16; 
  totalPages = 1;
  emailSubscription = '';
  showError = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  addToCart(product: Product): void {
    const cartItem: CartItem = {
      id: product.id,           // Cart item ID (same as product ID for simplicity)
      productId: product.id,    // Actual product ID from database
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    };
    this.cartService.addToCart(cartItem);
  }

  formatCurrency(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  subscribeNewsletter(): void {
    if (this.emailSubscription && this.validateEmail(this.emailSubscription)) {
      console.log('Subscribed:', this.emailSubscription);
      this.emailSubscription = '';
    } else {
      console.error('Invalid email address');
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  getCurrentPageProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  onSubscribe(): void {
    if (!this.isValidEmail(this.emailSubscription)) {
      this.showError = true;
      return;
    }
    this.showError = false;
    // Handle subscription logic here
    console.log('Subscribed with email:', this.emailSubscription);
    this.emailSubscription = '';
  }
}
