import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends ApiService {
  private endpoint = '/products';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  private mapProduct(raw: Record<string, unknown>): Product {
    const imageUrl = (raw['imageUrl'] as string) || (raw['image'] as string) || 'f1.jpg';
    const price = raw['price'];
    return {
      id: Number(raw['id']),
      name: String(raw['name'] ?? ''),
      brand: String(raw['brand'] ?? 'Cara'),
      price: typeof price === 'number' ? price : Number(price),
      image: imageUrl,
      category: raw['category'] as string | undefined,
      description: raw['description'] as string | undefined,
      stockQuantity: raw['stockQuantity'] as number | undefined,
      rating: 4,
      newArrival: imageUrl.startsWith('n')
    };
  }

  private toApiPayload(product: Product): Record<string, unknown> {
    return {
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      stockQuantity: product.stockQuantity ?? 0,
      imageUrl: product.image,
      category: product.category ?? 'Shirts'
    };
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Record<string, unknown>[]>(`${this.baseUrl}${this.endpoint}`).pipe(
      map(items => items.map(p => this.mapProduct(p))),
      catchError(err => throwError(() => err))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p => !p.newArrival).slice(0, 8))
    );
  }

  getNewArrivals(): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p => p.newArrival).slice(0, 8))
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.getProduct(id).pipe(
      map(p => p ?? undefined),
      catchError(() => throwError(() => new Error('Product not found')))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Record<string, unknown>>(`${this.baseUrl}${this.endpoint}/${id}`).pipe(
      map(p => this.mapProduct(p)),
      catchError(err => throwError(() => err))
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Record<string, unknown>>(
      `${this.baseUrl}${this.endpoint}`,
      this.toApiPayload(product),
      { headers: this.getHeaders() }
    ).pipe(
      map(p => this.mapProduct(p)),
      catchError(err => throwError(() => err))
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Record<string, unknown>>(
      `${this.baseUrl}${this.endpoint}/${id}`,
      this.toApiPayload(product),
      { headers: this.getHeaders() }
    ).pipe(
      map(p => this.mapProduct(p)),
      catchError(err => throwError(() => err))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.endpoint}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
