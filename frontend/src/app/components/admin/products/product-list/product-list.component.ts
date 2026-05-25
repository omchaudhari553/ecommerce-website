import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';
  selectedCategory = '';
  categories: string[] = [];
  loading = false;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        // Get unique categories and filter out undefined values
        this.categories = [...new Set(products
          .map(p => p.category)
          .filter((category): category is string => category !== undefined)
        )];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  filterProducts(): void {
    let filtered = this.products;
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        (product.brand?.toLowerCase() || '').includes(query) ||
        (product.category?.toLowerCase() || '').includes(query)
      );
    }
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }
    this.filteredProducts = filtered;
  }

  onSearch(): void {
    this.filterProducts();
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      this.error = '';
      
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          // Remove the product from local arrays
          this.products = this.products.filter(p => p.id !== id);
          this.filterProducts(); // This will update filteredProducts
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Failed to delete product:', err);
          this.error = 'Failed to delete product';
          this.loading = false;
        }
      });
    }
  }
}
