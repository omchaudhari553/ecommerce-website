import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;

  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  errorMessage: string | null = null;
  showPassword = false;
  isAdminLogin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  setLoginType(isAdmin: boolean): void {
    this.isAdminLogin = isAdmin;
    if (isAdmin) {
      this.email = 'omchaudhari979@gmail.com';
      this.password = '12345678';
    } else {
      this.email = '';
      this.password = '';
    }
    this.rememberMe = false;
    this.errorMessage = null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loading || !this.email || !this.password) return;

    this.loading = true;
    this.errorMessage = null;

    const loginObservable = this.isAdminLogin 
      ? this.authService.adminLogin(this.email, this.password, this.rememberMe)
      : this.authService.login(this.email, this.password, this.rememberMe);

    loginObservable.subscribe({
      next: (response) => {
        this.loading = false;
        if (response.user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
}
