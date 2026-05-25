import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isNavActive = false;
  isLoggedIn = false;
  isAdmin = false;
  cartItemCount = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    // Initialize state from auth service
    this.updateAuthState(this.authService.currentUser);
  }

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        console.log('Auth state changed:', { user, isLoggedIn: !!user });
        this.updateAuthState(user);
      })
    );
  }

  private updateAuthState(user: any): void {
    this.isLoggedIn = !!user;
    this.isAdmin = user?.role === 'admin';
    console.log('Updated auth state:', { isLoggedIn: this.isLoggedIn, isAdmin: this.isAdmin });

    // Only subscribe to cart if logged in and not admin
    if (this.isLoggedIn && !this.isAdmin) {
      this.subscribeToCart();
    } else {
      this.cartItemCount = 0;
    }
  }

  private subscribeToCart(): void {
    // Unsubscribe from previous cart subscription if exists
    this.subscriptions = this.subscriptions.filter(sub => {
      sub.unsubscribe();
      return false;
    });
    
    // Subscribe to cart updates
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe((items: CartItem[]) => {
        this.cartItemCount = items.length;
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  toggleNav(): void {
    this.isNavActive = !this.isNavActive;
  }

  closeNav(event: Event): void {
    event.preventDefault();
    this.isNavActive = false;
  }

  async logout(event: Event): Promise<void> {
    event.preventDefault();
    try {
      await this.authService.logout();
      this.updateAuthState(null);
      await this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
