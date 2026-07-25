import { NextRequest, NextResponse } from "next/server";
import { ProductController } from "../../../backend/modules/products/controllers/productController";
import { authGuard, roleGuard } from "@/src/backend/middlewares/authGuard";

const controller = new ProductController();

// Manejador para obtener productos (GET)

export async function GET(request: NextRequest) {
  return controller.getProducts(request);
}

// Manejador para crear un producto (POST)
export async function POST(request: NextRequest) {
  const authResult = await authGuard(request);

  if (authResult instanceof NextResponse) {
    return authResult; // Retorna 401 si el token no existe o expiró (20s)
  }

  const roleError = roleGuard(authResult.user.role, ["Administrador"]);
  if (roleError) {
    return roleError; // Retorna 403 si un 'Vendedor' intenta crear
  }

  return controller.createProduct(request);
}
