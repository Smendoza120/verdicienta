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
    tags: [
      {
        name: "Autenticación & Usuarios",
        description: "Endpoints para registro de cuentas, inicio de sesión y gestión de credenciales JWT.",
      },
      {
        name: "Productos",
        description: "Gestión del catálogo artesanal, precios, stock y categorías.",
      },
    ],
    // Configuración del esquema de seguridad JWT para Swagger UI
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Ingresa el token JWT obtenido en el inicio de sesión (`/api/auth/login`).",
        },
      },
    },
    // Definimos las operaciones directamente aquí como un objeto tipado seguro
    paths: {
      // ---------------- AUTH ENDPOINTS ----------------
      "/api/auth/register": {
        post: {
          tags: ["Autenticación & Usuarios"],
          summary: "Registrar un nuevo usuario",
          description: "Crea una cuenta en el sistema. Los roles válidos son 'Administrador' o 'Vendedor'. La contraseña se guarda encriptada.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string", example: "Laura Gómez" },
                    email: { type: "string", example: "laura@verdicienta.com" },
                    password: { type: "string", example: "Secret123!" },
                    role: { type: "string", enum: ["Administrador", "Vendedor"], example: "Vendedor" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Usuario registrado exitosamente." },
            400: { description: "El correo ya existe o faltan campos obligatorios." },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Autenticación & Usuarios"],
          summary: "Iniciar sesión de usuario",
          description: "Autentica las credenciales del usuario y emite un token JWT con tiempo de expiración (20 segundos para pruebas).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "laura@verdicienta.com" },
                    password: { type: "string", example: "Secret123!" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Inicio de sesión exitoso con token de acceso emitido." },
            401: { description: "Credenciales inválidas." },
          },
        },
      },
      
      // ---------------- USER MANAGEMENT ENDPOINTS ----------------
      "/api/users": {
        get: {
          tags: ["Autenticación & Usuarios"],
          summary: "Obtener lista de usuarios (Protegido - Admin)",
          description: "Retorna todos los usuarios del sistema. Requiere token Bearer JWT con rol 'Administrador'.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "query",
              name: "active",
              schema: { type: "boolean" },
              description: "Si es true, retorna solo usuarios activos. Si es false, retorna deshabilitados.",
            },
          ],
          responses: {
            200: { description: "Lista de usuarios obtenida con éxito." },
            401: { description: "No autorizado." },
            403: { description: "Acceso prohibido." },
          },
        },
      },
      "/api/users/active": {
        get: {
          tags: ["Autenticación & Usuarios"],
          summary: "Obtener únicamente usuarios activos (Protegido - Admin)",
          description: "Retorna el listado de usuarios con estado isActive: true.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista de usuarios activos obtenida con éxito.",
            },
            401: { description: "No autorizado." },
            403: { description: "Acceso prohibido. Requiere rol Administrador." },
          },
        },
      },
      "/api/users/{id}": {
        put: {
          tags: ["Autenticación & Usuarios"],
          summary: "Actualizar datos/estado de usuario (Protegido - Admin)",
          description: "Permite actualizar nombre, email, rol, o estado (isActive) de un usuario.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    role: { type: "string", enum: ["Administrador", "Vendedor"] },
                    isActive: { type: "boolean" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Usuario actualizado con éxito." },
            401: { description: "No autorizado." },
            403: { description: "Acceso prohibido." },
          },
        },
        delete: {
          tags: ["Autenticación & Usuarios"],
          summary: "Deshabilitar usuario (Borrado Lógico) (Protegido - Admin)",
          description: "Cambia isActive a false impidiendo que el usuario pueda iniciar sesión.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Usuario deshabilitado con éxito." },
            401: { description: "No autorizado." },
            403: { description: "Acceso prohibido." },
          },
        },
      },

      // ---------------- PRODUCT ENDPOINTS ----------------
      "/api/products": {
        get: {
          tags: ["Productos"],
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
          tags: ["Productos"],
          summary: "Crear un nuevo producto artesanal",
          description: "Registra un producto nuevo en la base de datos (Exclusivo Admin).",
          security: [{ bearerAuth: [] }],
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
          tags: ["Productos"],
          summary: "Actualizar un producto existente",
          description: "Modifica los campos enviados de un producto específico mediante su ID de MongoDB.",
          security: [{ bearerAuth: [] }],
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
          tags: ["Productos"],
          summary: "Deshabilitar un producto (Borrado lógico)",
          description: "Cambia el estado 'isActive' a false para que no se muestre en la tienda, protegiendo el historial.",
          security: [{ bearerAuth: [] }],
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