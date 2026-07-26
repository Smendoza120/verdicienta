import { AuthController } from "../../../../backend/modules/auth/controllers/authController";

const authController = new AuthController();

export async function POST() {
  return authController.logout();
}