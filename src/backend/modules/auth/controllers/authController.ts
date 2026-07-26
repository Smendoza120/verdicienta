import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../services/authService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Opciones estándar para la cookie segura
  private getCookieOptions() {
    return {
      httpOnly: true, // 🔒 Inaccesible para JavaScript / Protección XSS
      secure: process.env.NODE_ENV === "production", // HTTPS en producción
      sameSite: "lax" as const, // 🔒 Protección contra CSRF
      path: "/",
      maxAge: 24 * 60 * 60, // 1 día en segundos
    };
  }

  async register(request: NextRequest) {
    try {
      const body = await request.json();
      const result = await this.authService.register(body);

      const response = NextResponse.json(
        {
          success: true,
          data: result,
        },
        { status: 201 }
      );

      response.cookies.set("verdicienta_token", result.token, this.getCookieOptions());

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrar el usuario.";
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 400 }
      );
    }
  }

  async login(request: NextRequest) {
    try {
      const body = await request.json();
      const result = await this.authService.login(body);

      const response = NextResponse.json({
        success: true,
        data: result,
      });

      response.cookies.set("verdicienta_token", result.token, this.getCookieOptions());

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión.";
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 401 }
      );
    }
  }

  async logout() {
    const response = NextResponse.json({
      success: true,
      message: "Sesión cerrada correctamente.",
    });

    // Eliminamos la cookie 
    response.cookies.set("verdicienta_token", "", {
      ...this.getCookieOptions(),
      maxAge: 0,
    });

    return response;
  }

  async getUsers(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const activeParam = searchParams.get("active");
      const activeOnly = activeParam !== null ? activeParam === "true" : undefined;

      const users = await this.authService.getUsers(activeOnly);

      return NextResponse.json(
        {
          success: true,
          data: users,
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al obtener usuarios.";
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 500 }
      );
    }
  }

  async updateUser(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const updatedUser = await this.authService.updateUser(id, body);

      return NextResponse.json(
        {
          success: true,
          message: "Usuario actualizado con éxito.",
          data: updatedUser,
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar el usuario.";
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 400 }
      );
    }
  }

  async toggleUserStatus(id: string, isActive: boolean) {
    try {
      const updatedUser = await this.authService.toggleUserStatus(id, isActive);
      const action = isActive ? "habilitado" : "deshabilitado";

      return NextResponse.json(
        {
          success: true,
          message: `Usuario ${action} con éxito.`,
          data: updatedUser,
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al cambiar el estado del usuario.";
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 400 }
      );
    }
  }
}