import { NextRequest } from "next/server";
import { AuthController } from "../../../../backend/modules/auth/controllers/authController";

const authController = new AuthController();

export async function POST(request: NextRequest) {
  return authController.register(request);
}