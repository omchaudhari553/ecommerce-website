export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  brand: string;
  category?: string;
  image: string;
  stockQuantity?: number;
  rating?: number;
  featured?: boolean;
  newArrival?: boolean;
}
