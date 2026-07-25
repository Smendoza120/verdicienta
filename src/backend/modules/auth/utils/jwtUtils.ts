import jwt from "jsonwebtoken";
import { JWTPayload } from "../interfaces/userInterface";

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "20s";

// Firma un nuevo token JWT con la identidad del usuario y tiempo de expiración
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

// Verifica y decodifica un token JWT. Retorna el payload o null si es inválido/expiró
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}