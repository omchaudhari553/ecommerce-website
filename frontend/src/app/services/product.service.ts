import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  deleteProduct(id: number): Observable<void> {
    // Filter out the product with the given id
    this.products = this.products.filter(p => p.id !== id);
    // Return an Observable that emits void
    return of(void 0);
  }
  private products: Product[] = [
    {
      id: 1,
      name: 'Cartoon Astronaut T-Shirt',
      brand: 'adidas',
      price: 647, // ₹647 (reduced for testing)
      image: 'f1.jpg',
      category: 'T-Shirts',
      description: 'High-quality cotton t-shirt with unique astronaut design',
      stockQuantity: 50,
      rating: 5,
      newArrival: false
    },
    {
      id: 2,
      name: 'Floral Print Shirt',
      brand: 'zara',
      price: 564, // ₹564 (reduced for testing)
      image: 'f2.jpg',
      category: 'Shirts',
      description: 'Stylish floral print shirt perfect for summer',
      stockQuantity: 45,
      rating: 4,
      newArrival: false
    },
    {
      id: 3,
      name: 'Classic White Shirt',
      brand: 'levis',
      price: 738, // ₹738 (reduced for testing)
      image: 'f3.jpg',
      category: 'Shirts',
      description: 'Classic white shirt for formal occasions',
      stockQuantity: 30,
      rating: 4,
      newArrival: false
    },
    {
      id: 4,
      name: 'Vintage Print T-Shirt',
      brand: 'nike',
      price: 481, // ₹481 (reduced for testing)
      image: 'f4.jpg',
      category: 'T-Shirts',
      description: 'Vintage style printed t-shirt',
      stockQuantity: 60,
      rating: 5,
      newArrival: false
    },
    {
      id: 5,
      name: 'Denim Shirt',
      brand: 'levis',
      price: 812, // ₹812 (reduced for testing)
      image: 'f5.jpg',
      category: 'Shirts',
      description: 'Classic denim shirt with modern fit',
      stockQuantity: 25,
      rating: 4,
      newArrival: false
    },
    {
      id: 6,
      name: 'Casual Overshirt',
      brand: 'zara',
      price: 705, // ₹705 (reduced for testing)
      image: 'f6.jpg',
      category: 'Shirts',
      description: 'Casual overshirt perfect for layering',
      stockQuantity: 35,
      rating: 4,
      newArrival: false
    },
    {
      id: 7,
      name: 'Printed Summer Shirt',
      brand: 'h&m',
      price: 623, // ₹623 (reduced for testing)
      image: 'f7.jpg',
      category: 'Shirts',
      description: 'Light and breezy summer shirt with unique print',
      stockQuantity: 40,
      rating: 4,
      newArrival: false
    },
    {
      id: 8,
      name: 'Striped Casual Shirt',
      brand: 'pull&bear',
      price: 538, // ₹538 (reduced for testing)
      image: 'f8.jpg',
      category: 'Shirts',
      description: 'Casual striped shirt for everyday wear',
      stockQuantity: 55,
      rating: 4,
      newArrival: false
    },
    {
      id: 9,
      name: 'New Collection Shirt',
      brand: 'zara',
      price: 787, // ₹787 (reduced for testing)
      image: 'n1.jpg',
      category: 'Shirts',
      description: 'Latest collection formal shirt',
      stockQuantity: 20,
      rating: 5,
      newArrival: true
    },
    {
      id: 10,
      name: 'Modern Fit Shirt',
      brand: 'h&m',
      price: 732, // ₹732 (reduced for testing)
      image: 'n2.jpg',
      category: 'Shirts',
      description: 'Modern fit shirt with unique design',
      stockQuantity: 30,
      rating: 4,
      newArrival: true
    },
    {
      id: 11,
      name: 'Summer Collection Shirt',
      brand: 'pull&bear',
      price: 597, // ₹597 (reduced for testing)
      image: 'n3.jpg',
      category: 'Shirts',
      description: 'Light summer collection shirt',
      stockQuantity: 45,
      rating: 4,
      newArrival: true
    },
    {
      id: 12,
      name: 'Casual Summer Shirt',
      brand: 'levis',
      price: 564, // ₹564 (reduced for testing)
      image: 'n4.jpg',
      category: 'Shirts',
      description: 'Casual shirt perfect for summer',
      stockQuantity: 50,
      rating: 5,
      newArrival: true
    },
    {
      id: 13,
      name: 'Denim Collection Shirt',
      brand: 'levis',
      price: 764, // ₹764 (reduced for testing)
      image: 'n5.jpg',
      category: 'Shirts',
      description: 'New denim collection shirt',
      stockQuantity: 25,
      rating: 4,
      newArrival: true
    },
    {
      id: 14,
      name: 'Classic Fit Shirt',
      brand: 'zara',
      price: 647, // ₹647 (reduced for testing)
      image: 'n6.jpg',
      category: 'Shirts',
      description: 'Classic fit shirt for formal wear',
      stockQuantity: 35,
      rating: 4,
      newArrival: true
    },
    {
      id: 15,
      name: 'Premium Cotton Shirt',
      brand: 'h&m',
      price: 705, // ₹705 (reduced for testing)
      image: 'n7.jpg',
      category: 'Shirts',
      description: 'Premium cotton shirt with modern design',
      stockQuantity: 40,
      rating: 5,
      newArrival: true
    },
    {
      id: 16,
      name: 'Slim Fit Shirt',
      brand: 'pull&bear',
      price: 680, // ₹680 (reduced for testing)
      image: 'n8.jpg',
      category: 'Shirts',
      description: 'Slim fit shirt for a modern look',
      stockQuantity: 30,
      rating: 4,
      newArrival: true
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return of(this.products.filter(p => !p.newArrival).slice(0, 8));
  }

  getNewArrivals(): Observable<Product[]> {
    return of(this.products.filter(p => p.newArrival).slice(0, 8));
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }
}
