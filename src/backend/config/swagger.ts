import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Verdicienta API - Catálogo Artesanal",
      version: "1.0.0",
      description: "Documentación oficial del backend para la tienda en línea Verdicienta, desarrollada con Next.js y MongoDB.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local de Desarrollo",
      },
    ],
    // Definimos las operaciones directamente aquí como un objeto tipado seguro
    paths: {
      "/api/products": {
        get: {
          summary: "Obtener el catálogo de productos",
          description: "Retorna los productos de la tienda. Permite filtrar solo activos para los clientes o retornar todos para el administrador.",
          parameters: [
            {
              in: "query",
              name: "active",
              schema: {
                type: "boolean"
              },
              description: "Si es true, retorna solo productos con isActive en true. Si se omite, retorna todo (Admin)."
            }
          ],
          responses: {
            200: { description: "Lista de productos obtenida con éxito." },
            500: { description: "Error interno del servidor." }
          }
        },
        post: {
          summary: "Crear un nuevo producto artesanal",
          description: "Registra un producto nuevo en la base de datos (Exclusivo Admin).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "price", "category"],
                  properties: {
                    title: { type: "string" },
                    price: { type: "number" },
                    stock: { type: "number" },
                    category: { type: "string" },
                    images: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: "Producto creado con éxito." },
            400: { description: "Faltan campos obligatorios." },
            500: { description: "Error interno del servidor." }
          }
        }
      },
      "/api/products/{id}": {
        put: {
          summary: "Actualizar un producto existente",
          description: "Modifica los campos enviados de un producto específico mediante su ID de MongoDB.",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "ID único del producto en MongoDB."
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    price: { type: "number" },
                    stock: { type: "number" },
                    category: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Producto actualizado con éxito." },
            404: { description: "Producto no encontrado." },
            500: { description: "Error interno del servidor." }
          }
        },
        delete: {
          summary: "Deshabilitar un producto (Borrado lógico)",
          description: "Cambia el estado 'isActive' a false para que no se muestre en la tienda, protegiendo el historial.",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "ID único del producto en MongoDB."
            }
          ],
          responses: {
            200: { description: "Producto deshabilitado correctamente." },
            404: { description: "Producto no encontrado." },
            500: { description: "Error interno del servidor." }
          }
        }
      }
    }
  },
  // Al definir las rutas manualmente en 'paths', dejamos este array vacío para evitar escaneos conflictivos
  apis: [], 
};

export const spec = swaggerJSDoc(options);