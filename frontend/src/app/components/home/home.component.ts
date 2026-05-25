import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class HomeComponent implements OnInit {
  features = [
    { image: 'assets/img/features/f1.png', title: 'Free Shipping' },
    { image: 'assets/img/features/f2.png', title: 'Online Order' },
    { image: 'assets/img/features/f3.png', title: 'Save Money' },
    { image: 'assets/img/features/f4.png', title: 'Promotions' },
    { image: 'assets/img/features/f5.png', title: 'Happy Sell' },
    { image: 'assets/img/features/f6.png', title: 'F24/7 Support' }
  ];

  featuredProducts: Product[] = [];
  newArrivals: Product[] = [];
  emailSubscription: string = '';
  showError: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getProducts().subscribe({
      next: (products) => {
        // Filter featured products (first 8)
        this.featuredProducts = products
          .filter(p => !p.newArrival)
          .slice(0, 8);

        // Filter new arrivals (first 8)
        this.newArrivals = products
          .filter(p => p.newArrival)
          .slice(0, 8);

        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  addToCart(product: Product): void {
    if (!product.id) {
      console.error('Cannot add product without ID to cart');
      return;
    }

    const cartItem: CartItem = {
      id: product.id,
      productId: product.id,
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
      currency: 'INR'
    }).format(price);
  }

  subscribeNewsletter(): void {
    this.showError = true;
    
    if (!this.emailSubscription) {
      return;
    }

    if (!this.isValidEmail(this.emailSubscription)) {
      return;
    }

    // TODO: Implement newsletter subscription logic
    console.log('Newsletter subscription for:', this.emailSubscription);
    alert('Thank you for subscribing to our newsletter!');
    this.emailSubscription = '';
    this.showError = false;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
