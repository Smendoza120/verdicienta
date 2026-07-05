import { Document } from "mongoose";

/**
 * Estructura de datos base para un Producto artesanal en Verdicienta
 */
export interface IProductBase {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  isActive: boolean;
}

/**
 * Interfaz extendida para el uso exclusivo de Mongoose en el Backend
 */
export interface IProduct extends IProductBase, Document {
  createdAt: Date;
  updatedAt: Date;
}