export interface CartItem {
  id: number;              // Cart item ID (unique for each cart entry)
  productId: number;       // Actual product ID from database
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
  imageUrl?: string;
  category?: string;
  brand?: string;
  stockQuantity?: number;
}
