import { connectDB } from "../../../config/db";
import Product from "../models/Product";
import { IProduct } from "../types/product.types";

export class ProductService {
  /**
   * Obtiene TODOS los productos de la base de datos (Activos y Deshabilitados)
   * Diseñado exclusivamente para el Panel de Administración.
   */
  async getAllProducts(): Promise<IProduct[]> {
    await connectDB();
    return await Product.find({}).sort({ createdAt: -1 }); // Sin filtros, retorna todo el historial
  }

  /**
   * Obtiene todos los productos activos
   */
  async getAllActiveProducts(): Promise<IProduct[]> {
    await connectDB();
    return await Product.find({ isActive: true }).sort({ createdAt: -1 });
  }

  /**
   * Crea un nuevo producto artesanal
   */
  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    await connectDB();
    const newProduct = new Product(productData);
    return await newProduct.save();
  }

  /**
   * Actualiza un producto existente por su ID
   */
  async updateProduct(
    id: string,
    productData: Partial<IProduct>,
  ): Promise<IProduct | null> {
    await connectDB();
    return await Product.findByIdAndUpdate(id, productData, {
      new: true, // Retorna el documento ya modificado
      runValidators: true, // Ejecuta las validaciones del esquema
    });
  }

  /**
   * Deshabilitación lógica (Borrado lógico) de un producto
   */
  async disableProduct(id: string): Promise<IProduct | null> {
    await connectDB();
    return await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
  }
}
