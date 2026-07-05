import { NextRequest } from "next/server";
import { ProductController } from "../../../backend/modules/products/controllers/productController";

const controller = new ProductController();

// Manejador para obtener productos (GET)

export async function GET(request: NextRequest) {
  return controller.getProducts(request);
}

// Manejador para crear un producto (POST)

export async function POST(request: NextRequest) {
  return controller.createProduct(request);
}
