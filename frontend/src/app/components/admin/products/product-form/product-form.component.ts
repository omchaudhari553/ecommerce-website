import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    brand: '',
    stockQuantity: 0,
    featured: false,
    newArrival: false
  };
  isEditing = false;
  loading = false;
  error = '';
  categories = ['T-Shirts', 'Shirts', 'Pants', 'Jackets', 'Shoes', 'Accessories'];

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load product. Please try again.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    const operation = this.isEditing
      ? this.productService.updateProduct(this.product.id!, this.product)
      : this.productService.addProduct(this.product);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/admin/products']);
      },
      error: (err: any) => {
        this.error = 'Failed to save product. Please try again.';
        this.loading = false;
      }
    });
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.product.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
