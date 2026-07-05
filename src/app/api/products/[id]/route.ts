import { NextRequest } from "next/server";
import { ProductController } from "../../../../backend/modules/products/controllers/productController";

const controller = new ProductController();

type RouteParams = {
  params: Promise<{ id: string }>;
};

// Manejador para actualizar un producto (PUT)

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return controller.updateProduct(request, id);
}

// Manejador para deshabilitar un producto (DELETE)

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return controller.deleteProduct(id);
}