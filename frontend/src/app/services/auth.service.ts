import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

interface AuthResponse {
  user: User;
  message: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) + '/auth' : `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  // Admin credentials
  private readonly ADMIN_EMAIL = 'omchaudhari979@gmail.com';
  private readonly ADMIN_PASSWORD = '12345678';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize user from storage
    const storedUser = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): User | null {
    try {
      // Check both localStorage and sessionStorage
      const localUser = localStorage.getItem('currentUser');
      const sessionUser = sessionStorage.getItem('currentUser');
      const userStr = localUser || sessionUser;
      
      if (userStr) {
        const user = JSON.parse(userStr);
        // Validate user object
        if (user && user.id && user.email && user.role) {
          return user;
        }
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
      // Clear invalid data
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
    }
    return null;
  }

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string, rememberMe: boolean = false): Observable<AuthResponse> {
    // Prevent admin login through regular login
    if (email.trim().toLowerCase() === this.ADMIN_EMAIL.toLowerCase()) {
      return throwError(() => new Error('Please use admin login for administrator access.'));
    }

    // Connect to backend for user authentication
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email: email.trim(),
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(response => {
        console.log('Login response:', response);
        if (response && response.user) {
          if (response.user.role === 'admin') {
            throw new Error('Please use admin login for administrator access.');
          }
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        let errorMessage = 'Invalid email or password';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  adminLogin(email: string, password: string, rememberMe: boolean = false): Observable<AuthResponse> {
    // Check admin credentials
    if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 1,
        email: email,
        name: 'Admin',
        role: 'admin'
      };

      const response: AuthResponse = {
        user: adminUser,
        message: 'Admin login successful',
        status: 'success'
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('currentUser', JSON.stringify(adminUser));
      this.currentUserSubject.next(adminUser);

      return of(response);
    }

    return throwError(() => new Error('Invalid admin credentials'));
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  async logout(): Promise<void> {
    try {
      // Remove user from storage
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      await this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUser;
    return !!user && user.role === 'admin';
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred. Please try again.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || errorMessage;
    }
    return throwError(() => new Error(errorMessage));
  }
}
