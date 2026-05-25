import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if ([401, 403].includes(error.status) && this.authService.currentUser) {
          // Auto logout if 401 or 403 response returned from api
          this.authService.logout();
        }

        const errorMessage = this.getErrorMessage(error);
        return throwError(() => errorMessage);
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return error.error.message;
    }

    // Server-side error
    switch (error.status) {
      case 400:
        return this.handleBadRequest(error);
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return this.handleValidationError(error);
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Internal server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }

  private handleBadRequest(error: HttpErrorResponse): string {
    if (typeof error.error === 'string') {
      return error.error;
    }
    if (error.error?.message) {
      return error.error.message;
    }
    return 'Bad request. Please check your input and try again.';
  }

  private handleValidationError(error: HttpErrorResponse): string {
    if (error.error?.errors) {
      const errors = error.error.errors;
      if (Array.isArray(errors)) {
        return errors.join(' ');
      }
      if (typeof errors === 'object') {
        return Object.values(errors).flat().join(' ');
      }
    }
    return 'Validation error. Please check your input and try again.';
  }
}
