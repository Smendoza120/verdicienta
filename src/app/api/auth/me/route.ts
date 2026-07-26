import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "../../../../backend/middlewares/authGuard";
import { UserModel } from "../../../../backend/modules/auth/models/userModel";
import { connectDB } from "../../../../backend/config/db";

export async function GET(request: NextRequest) {
  const authResult = await authGuard(request);

  if (authResult instanceof NextResponse) {
    return authResult; // Devuelve 401 si no hay cookie o expiró
  }

  await connectDB();
  const user = await UserModel.findById(authResult.user.id);

  if (!user || !user.isActive) {
    return NextResponse.json(
      { success: false, error: "Usuario no encontrado o deshabilitado." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
}