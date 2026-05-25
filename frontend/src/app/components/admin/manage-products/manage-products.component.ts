import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = 'all';
  categories = ['electronics', 'clothing', 'books', 'accessories'];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  constructor() {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Format price in Indian Rupees
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }

  // Handle image error
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/img/hero4.png';  // Using an existing image as placeholder
    }
  }

  private loadProducts(): void {
    // Simulated data with actual images from assets and prices in INR
    this.products = [
      { 
        id: 1, 
        name: 'Premium T-Shirt', 
        price: 599, 
        stock: 50, 
        category: 'clothing',
        image: 'assets/img/products/f1.jpg'
      },
      { 
        id: 2, 
        name: 'Casual Shirt', 
        price: 699, 
        stock: 100, 
        category: 'clothing',
        image: 'assets/img/products/f2.jpg'
      },
      { 
        id: 3, 
        name: 'Designer Jacket', 
        price: 999, 
        stock: 5, 
        category: 'clothing',
        image: 'assets/img/products/f3.jpg'
      },
      { 
        id: 4, 
        name: 'Classic Polo', 
        price: 549, 
        stock: 75, 
        category: 'clothing',
        image: 'assets/img/products/f4.jpg'
      },
      { 
        id: 5, 
        name: 'Summer Dress', 
        price: 799, 
        stock: 30, 
        category: 'clothing',
        image: 'assets/img/products/f5.jpg'
      },
      { 
        id: 6, 
        name: 'Denim Jacket', 
        price: 899, 
        stock: 25, 
        category: 'clothing',
        image: 'assets/img/products/f6.jpg'
      },
      { 
        id: 7, 
        name: 'Casual Pants', 
        price: 649, 
        stock: 60, 
        category: 'clothing',
        image: 'assets/img/products/f7.jpg'
      },
      { 
        id: 8, 
        name: 'Fashion Set', 
        price: 999, 
        stock: 15, 
        category: 'clothing',
        image: 'assets/img/products/f8.jpg'
      },
      { 
        id: 9, 
        name: 'Sport Shoes', 
        price: 849, 
        stock: 40, 
        category: 'accessories',
        image: 'assets/img/products/n1.jpg'
      },
      { 
        id: 10, 
        name: 'Running Shoes', 
        price: 899, 
        stock: 35, 
        category: 'accessories',
        image: 'assets/img/products/n2.jpg'
      },
      { 
        id: 11, 
        name: 'Casual Shoes', 
        price: 749, 
        stock: 45, 
        category: 'accessories',
        image: 'assets/img/products/n3.jpg'
      },
      { 
        id: 12, 
        name: 'Classic Shoes', 
        price: 799, 
        stock: 20, 
        category: 'accessories',
        image: 'assets/img/products/n4.jpg'
      }
    ];
    this.filterProducts();
  }

  filterProducts(): void {
    let filtered = this.products;
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category === this.selectedCategory
      );
    }

    this.filteredProducts = filtered;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filters change
  }

  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      // TODO: Implement actual delete functionality with API call
      this.products = this.products.filter(product => product.id !== id);
      this.filterProducts();
    }
  }
} 