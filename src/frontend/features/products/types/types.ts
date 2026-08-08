export interface Product {
  id: string; // Mapeado desde _id de Mongo
  name: string; // Mapeado desde title
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  isActive?: boolean;
}

export interface ProductDraft {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MongoProductDocument {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: string[];
  isActive?: boolean;
}