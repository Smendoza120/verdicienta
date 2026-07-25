import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "../../../../backend//modules/auth/controllers/authController";
import { authGuard, roleGuard } from "../../../../backend//middlewares/authGuard";

const authController = new AuthController();

/**
 * GET /api/users/active
 * Retorna únicamente los usuarios que están habilitados (isActive: true).
 * Protegido: Requiere token JWT de Administrador.
 */
export async function GET(request: NextRequest) {
  const authResult = await authGuard(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Verificar que el usuario tenga rol de Administrador
  const roleError = roleGuard(authResult.user.role, ["Administrador"]);
  if (roleError) {
    return roleError;
  }

  // Modificamos el parámetro en la URL para forzar solo usuarios activos
  const url = new URL(request.url);
  url.searchParams.set("active", "true");

  const modifiedRequest = new NextRequest(url.toString(), {
    headers: request.headers,
  });

  return authController.getUsers(modifiedRequest);
}