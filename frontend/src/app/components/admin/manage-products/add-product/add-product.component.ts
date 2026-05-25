import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ProductForm {
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddProductComponent {
  product: ProductForm = {
    name: '',
    price: 0,
    stock: 0,
    category: '',
    description: '',
    imageUrl: ''
  };

  categories: string[] = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys'
  ];

  constructor(private router: Router) {}

  onSubmit(): void {
    console.log('Product to be added:', this.product);
    // TODO: Implement actual product creation logic
    this.router.navigate(['/admin/manage-products']);
  }

  onCancel(): void {
    this.router.navigate(['/admin/manage-products']);
  }
} 