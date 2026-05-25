import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit, OnDestroy {
  isNavActive = false;
  private authSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if user is admin, if not redirect to login
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/auth/login']);
        return;
      }
      
      if (user.role !== 'admin') {
        this.authService.logout(); // Force logout if not admin
        this.router.navigate(['/auth/login']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
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
    this.authService.logout();
    await this.router.navigate(['/auth/login']);
  }
} 