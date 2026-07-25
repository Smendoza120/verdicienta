import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "../../../../backend/modules/auth/controllers/authController";
import { authGuard, roleGuard } from "../../../../backend/middlewares/authGuard";

const authController = new AuthController();

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PUT /api/users/[id] -> Actualiza campos (nombre, correo, rol, isActive)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authResult = await authGuard(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const roleError = roleGuard(authResult.user.role, ["Administrador"]);
  if (roleError) {
    return roleError;
  }

  const { id } = await params;
  return authController.updateUser(request, id);
}

// DELETE /api/users/[id] -> Borrado lógico (Deshabilita colocando isActive: false)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResult = await authGuard(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const roleError = roleGuard(authResult.user.role, ["Administrador"]);
  if (roleError) {
    return roleError;
  }

  const { id } = await params;
  return authController.toggleUserStatus(id, false);
}