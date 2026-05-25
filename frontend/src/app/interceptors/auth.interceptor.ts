import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const currentUser = this.authService.currentUser;
    const token = currentUser?.token;

    // Clone the request and add auth header if token exists
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          if (!this.isRefreshing) {
            this.isRefreshing = true;

            // Try to refresh token
            return this.authService.refreshToken().pipe(
              switchMap((response) => {
                this.isRefreshing = false;
                // Add new token to request
                return next.handle(this.addToken(request, response.token));
              }),
              catchError((refreshError) => {
                this.isRefreshing = false;
                // If refresh token fails, logout user
                this.authService.logout();
                return throwError(() => refreshError);
              })
            );
          }
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
