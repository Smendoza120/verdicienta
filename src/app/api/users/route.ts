import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "../../../backend/modules/auth/controllers/authController";
import { authGuard, roleGuard } from "../../../backend/middlewares/authGuard";

const authController = new AuthController();

export async function GET(request: NextRequest) {
  const authResult = await authGuard(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const roleError = roleGuard(authResult.user.role, ["Administrador"]);
  if (roleError) {
    return roleError;
  }

  return authController.getUsers(request);
}