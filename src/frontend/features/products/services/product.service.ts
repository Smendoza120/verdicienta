import { ApiResponse, MongoProductDocument, Product, ProductDraft } from "../types/types";

// Mapea _id -> id y title -> name
function mapProductFromBackend(raw: MongoProductDocument): Product {
  return {
    id: raw._id || raw.id || "",
    name: raw.title || raw.name || "Producto sin nombre",
    description: raw.description || "",
    price: typeof raw.price === "number" ? raw.price : 0,
    stock: typeof raw.stock === "number" ? raw.stock : 0,
    category: raw.category || "otros",
    images: Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : ["/placeholder.svg"],
    isActive: raw.isActive ?? true,
  };
}

// Mapea name -> title para MongoDB
function mapProductToBackend(draft: ProductDraft) {
  return {
    title: draft.name,
    description: draft.description,
    price: Number(draft.price),
    stock: Number(draft.stock),
    category: draft.category,
    images: draft.images.length > 0 ? draft.images : ["/placeholder.svg"],
  };
}

export const productService = {
  async getAllProducts(onlyActive = false): Promise<Product[]> {
    const res = await fetch(`/api/products${onlyActive ? "?active=true" : ""}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json: ApiResponse<MongoProductDocument[]> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || "Error al obtener productos");
    }

    return json.data.map(mapProductFromBackend);
  },

  async createProduct(draft: ProductDraft): Promise<Product> {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapProductToBackend(draft)),
    });

    const json: ApiResponse<MongoProductDocument> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || "Error al crear el producto");
    }

    return mapProductFromBackend(json.data);
  },

  async updateProduct(id: string, draft: ProductDraft): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapProductToBackend(draft)),
    });

    const json: ApiResponse<MongoProductDocument> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || "Error al actualizar el producto");
    }

    return mapProductFromBackend(json.data);
  },

  async disableProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    const json: ApiResponse<null> = await res.json();
    if (!json.success) {
      throw new Error(json.error || "Error al deshabilitar el producto");
    }
  },
};