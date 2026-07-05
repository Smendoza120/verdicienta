import mongoose, { Schema, Model } from "mongoose";
import { IProduct } from "../types/product.types";

const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: { 
      type: String, 
      required: [true, "El título del producto es obligatorio"], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, "La descripción es obligatoria"] 
    },
    price: { 
      type: Number, 
      required: [true, "El precio es obligatorio"], 
      min: [0, "El precio no puede ser negativo"] 
    },
    stock: { 
      type: Number, 
      required: [true, "El stock es obligatorio"], 
      min: [0, "El stock no puede ser negativo"],
      default: 0 
    },
    category: { 
      type: String, 
      required: [true, "La categoría es obligatoria"], 
      trim: true 
    },
    images: { 
      type: [String], 
      default: [] 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  {
    timestamps: true, 
  }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;