import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "../services/productService";

const productService = new ProductService();

export class ProductController {
  /**
   * GET /api/products
   */
  async getProducts(request: NextRequest) {
    try {
      // Extraemos los query params de la URL
      const { searchParams } = new URL(request.url);
      const onlyActive = searchParams.get("active") === "true";

      // Decidimos qué método del servicio ejecutar según el parámetro
      const products = onlyActive 
        ? await productService.getAllActiveProducts()
        : await productService.getAllProducts();

      return NextResponse.json({ success: true, data: products }, { status: 200 });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al obtener los productos";
      return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
  }

  /**
   * POST /api/products
   */
  async createProduct(request: NextRequest) {
    try {
      const body = await request.json();

      // Validación básica
      if (!body.title || !body.price || !body.category) {
        return NextResponse.json(
          {
            success: false,
            error: "Faltan campos obligatorios (title, price, category)",
          },
          { status: 400 },
        );
      }

      const newProduct = await productService.createProduct(body);
      return NextResponse.json(
        { success: true, data: newProduct },
        { status: 201 },
      );
    } catch (error: unknown) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message || "Error al crear el producto",
        },
        { status: 500 },
      );
    }
  }

  /**
   * PUT /api/products/[id]
   */
  async updateProduct(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const updatedProduct = await productService.updateProduct(id, body);

      if (!updatedProduct) {
        return NextResponse.json(
          { success: false, error: "Producto no encontrado" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { success: true, data: updatedProduct },
        { status: 200 },
      );
    } catch (error: unknown) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message || "Error al actualizar el producto",
        },
        { status: 500 },
      );
    }
  }

  /**
   * DELETE /api/products/[id]
   */
  async deleteProduct(id: string) {
    try {
      const disabledProduct = await productService.disableProduct(id);

      if (!disabledProduct) {
        return NextResponse.json(
          { success: false, error: "Producto no encontrado" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Producto deshabilitado correctamente (Borrado lógico)",
        },
        { status: 200 },
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al deshabilitar el producto";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 },
      );
    }
  }
}
